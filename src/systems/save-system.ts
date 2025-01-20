import { Component, Entity, Scene, System, SystemType } from "excalibur";
import { isArray } from "../utility/is-array";
import { isString } from "../utility/is-string";

export interface Serializable {
    serialize(): any;
    deserialize(data: any): void;
    serializeId?: string;
    getChildObjects?(): any[];
    addChildObject?(obj: any, data: any): void;
}

function isSerializable(obj: any): obj is Serializable {
    if (obj == null) {
        return false;
    }
    return obj.serialize !== undefined && obj.deserialize !== undefined;
}

export type SerializableObject = Scene | Scene[] | Entity | Entity[] | Component | Component[] | Serializable | Serializable[];

export type LoadOptions = {
    obj: SerializableObject;
    data: string | object;
}

export type SerialisedObject = {
    className: string;
    id?: string;
    data: any;
}

type SerializedData = {
    object: SerialisedObject | null;
    children: SerializedData[];
}

function getChildren(obj: SerializableObject) {
    if (isSerializable(obj)) {
        if (obj.getChildObjects != null) {
            return obj.getChildObjects();
        }
    }
    if (obj instanceof Scene) {
        let entities = obj.entities.filter((e) => e.parent == null) as Entity[];
        return entities;
    }
    if (obj instanceof Entity) {
        return [...obj.getComponents(), ...obj.children];
    }
    if (obj instanceof Component) {
        return [];
    }
    return [];
}

function addChild(parent: SerializableObject, child: SerializableObject, data?: any) {
    if (isSerializable(parent)) {
        if (parent.addChildObject != null) {
            parent.addChildObject(child, data);
            return;
        }
    }
    if (parent instanceof Scene) {
        if (child instanceof Entity) {
            parent.add(child);
        } else {
            throw new Error('Cannot add a component to a scene object');
        }
    }

    if (parent instanceof Entity) {
        if (child instanceof Entity) {
            parent.addChild(child);
        }
        if (child instanceof Component) {
            parent.addComponent(child);
        }
    }

}

type ClassMapping = (new () => any);

export class SaveSystem extends System {
    classMappings: Record<string, ClassMapping> = {};
    constructor(classMappings: ClassMapping[]) {
        super();
        for (const mapping of classMappings) {
            this.classMappings[mapping.name] = mapping;
        }
    }

    addClassMapping(mapping: ClassMapping) {
        this.classMappings[mapping.name] = mapping;
    }
    getClassMapping(className: string | object): ClassMapping | null {
        if (typeof className !== 'string') {
            className = className.constructor.name;
        }

        return this.classMappings?.[className] ?? null;
    }
    isMappedClass(className: string | (ClassMapping)): boolean {
        return this.getClassMapping(className) !== null;
    }
    systemType: SystemType = SystemType.Draw;
    update(): void {
        // throw new Error("Method not implemented.");
    }
    generateSaveData(obj: SerializableObject): SerializedData | null {
        const data: SerializedData = {
            object: null,
            children: []
        }
        if (isArray<SerializableObject>(obj)) {
            for (const objChild of obj) {
                let childData = this.generateSaveData(objChild);
                if (childData) {
                    data.children.push(childData);
                }
            }
            if (data.children.length == 0) {

                return null;
            }
            return data;
        }

        obj = obj as SerializableObject

        if (!this.isMappedClass(obj.constructor.name)) {
            return null;
        }

        if (isSerializable(obj)) {
            const objectdata = obj.serialize();
            data.object = {
                className: obj.constructor.name,
                data: objectdata,
                id: obj.serializeId
            }
        }
        const children = getChildren(obj) ?? [];
        for (const child of children) {
            const childData = this.generateSaveData(child);
            if (childData) {
                if (childData.object != null || childData.children.length != 0) {
                    data.children.push(childData);
                }
            }
        }

        if (data.children.length == 0 && data.object == null) {
            return null;
        }

        return data;
    }

    save(obj: SerializableObject): any {
        let saveData;
        if (obj instanceof Scene) {
            const entities = obj.entities.filter((e) => e.parent == null) as Entity[];
            saveData = this.generateSaveData(entities)
        } else {
            saveData = this.generateSaveData(obj);
        }
        return saveData;
    }

    deserializeObject(obj: any, data: SerializedData): SerializedData {
        if (isSerializable(obj)) {
            obj.deserialize(data.object?.data);
        }

        // Here we prepare the mappings to see if we need to update a child record or if we need to create a new entity.       
        let children = getChildren(obj);

        let childrenMappings: Record<string, SerializableObject> = {}
        if (obj instanceof Scene) {
            for (const child of children) {
                if (isSerializable(child)) {
                    let id = child.serializeId;
                    if (id) {
                        childrenMappings[id] = child;
                    }
                }
            }
        } else {
            for (const child of children) {
                if (isSerializable(child)) {
                    let id = child.serializeId;
                    if (id) {
                        childrenMappings[id] = child;
                    }
                }
            }
        }

        for (const childData of data.children) {
            let child = childrenMappings[childData.object?.id ?? ''];
            if (!child) {
                if (childData.object) {
                    let childClass = this.getClassMapping(childData.object?.className);
                    if (childClass) {

                        child = new childClass();
                        addChild(obj, child, childData.object?.data);
                        this.deserializeObject(child, childData);


                        console.log({
                            childData,
                            child
                        });
                    }
                }
            }
            this.deserializeObject(child, childData);
        }


        return data;
    }

    load(options: LoadOptions) {
        try {
            let saveData: any = null;
            if (isString(options.data)) {
                try {
                    saveData = JSON.parse(options.data);
                } catch (e) {
                    throw new Error('Invalid save data, could not parse json.');
                }
            }
            this.deserializeObject(options.obj, saveData);
            return saveData;

        }
        catch (e) {
            console.error(e);
            return;
        }
    }

}