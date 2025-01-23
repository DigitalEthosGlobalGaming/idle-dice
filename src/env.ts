class EnvironmentSettings {

    static Global: EnvironmentSettings | null = null;
    static getEnvironmentSetting() {
        if (EnvironmentSettings.Global === null) {
            EnvironmentSettings.Global = new EnvironmentSettings();
        }
        return EnvironmentSettings.Global;
    }
    get buildVersion() {
        return import.meta.env.VITE_BUILD_VERSION || "dev";
    }

    get isDev() {
        return import.meta.env.DEV === true;
    }
}

export const Environment = EnvironmentSettings.getEnvironmentSetting();