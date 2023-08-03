import {Logger} from "./Logger";

export class VariablesExtractor {
    constructor() {
    }

    public getLogLevel(): string {
        const envVar = process.env.LOG_LEVEL;

        if (envVar) {
            return envVar;
        }

        Logger.error("env var LOG_LEVEL not set");

        return "";
    }

    public getRootConfig(): string {
        const envVar = process.env.ROOT_CONFIG;

        if (envVar) {
            return envVar;
        }

        Logger.error("env var ROOT_CONFIG not set");

        return "";
    }
}