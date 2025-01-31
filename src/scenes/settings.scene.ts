import * as ex from "excalibur";
import { Level } from "@src/level";
import { Panel } from "@src/ui/panel";
import { Label } from "@src/ui/elements/label";
import { List } from "@src/ui/elements/list";
import { Button } from "@src/ui/elements/button";
import { Environment } from "@src/env";


const settingsItems = [{
  name: "Graphics",
  code: "graphics",
  defaultValue: 0,
  options: [{
    label: "Advanced",
    value: 0
  },
  {
    label: "Basic",
    value: 1
  }]
},
{
  name: "Sound",
  code: "sound",
  defaultValue: 0,
  visible: false,
  options: [{
    label: "All",
    value: 0
  }, {
    label: "No Music",
    value: 1
  }, {
    label: "Off",
    value: 2
  }]
}];

const settingLabels: any = {};
for (const i in settingsItems) {
  for (const j in settingsItems[i].options) {
    const option = settingsItems[i].options[j];
    settingLabels[settingsItems[i].code + "-" + option.value] = option.label;
  }
}

class Ui extends Panel {
  get formData() {
    const data: any = {};
    for (const i in settingsItems) {
      const element = settingsItems[i];
      const code = element.code;
      data[code] = Environment.get(code);
    }
    return data;
  }
  set formData(value: any) {
    for (const i in settingsItems) {
      const element = settingsItems[i];
      const code = element.code;
      if (value[code] !== undefined) {
        Environment.set(code, value[code]);
      }
    }
  }
  onRender(): void {
    super.onRender();
    this.size = this.screenSize.scale(0.9);
    this.pos = this.screenSize.scale(0.5);

    const list = this.addPanel("list", List);
    list.spacing = 15;
    const data = this.formData;

    const label = list.addPanel(`label-Title`, Label);
    label.fontSize = 40;
    label.text = "Settings";

    for (const elementIndex in settingsItems) {
      const element = settingsItems[elementIndex];
      if (element.visible !== false) {
        const label = list.addPanel(`label-${element.name}`, Label);
        label.fontSize = 20;
        label.text = element.name;
        const value = data[element.code] ?? element.defaultValue;
        const button = list.addPanel("button-" + element.code, Button);
        button.text = settingLabels[element.code + "-" + value];
        button.fontSize = 16;
        button.onPointerUp = () => {
          let newValue = value + 1;
          if (newValue >= element.options.length) {
            newValue = 0;
          }

          this.formData = {
            [element.code]: value + 1 >= element.options.length ? 0 : value + 1
          }
          this.dirty = true;
        }
      }
    }

    const button = list.addPanel("back-button", Button);
    button.text = "Back";
    button.fontSize = 16;
    button.onClick = () => {
      this.scene?.engine.goToScene("WelcomeScene");
    };
  }
}

export class SettingsScene extends Level {
  mainPanel!: Ui;
  onActivate(context: ex.SceneActivationContext): void {
    super.onActivate(context);
    this.mainPanel = new Ui();
    this.add(this.mainPanel);
  }

  onDeactivate(context: ex.SceneActivationContext): void {
    super.onDeactivate(context);
    this.mainPanel?.kill();
    this.remove(this.mainPanel);
  }
}
