export class Logger {
    public static LogLevelEnum = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4
    };

    private static logLevelInt: number = 0;

    public static setLevel(newLevel: number): void {
        this.logLevelInt = newLevel;
        Logger.info("Running on log level: [" + newLevel+ "]");
    }

    public static getLevel(): number {
        return this.logLevelInt;
    }

    public static trace(message: string): void {
        if (this.logLevelInt <= this.LogLevelEnum.TRACE) {
            this.writeMessage("TRACE", message);
        }
    }

    public static debug(message: string): void {
        if (this.logLevelInt <= this.LogLevelEnum.DEBUG) {
            this.writeMessage("DEBUG", message);
        }
    }

    public static info(message: string): void {
        if (this.logLevelInt <= this.LogLevelEnum.INFO) {
            this.writeMessage("INFO", message);
        }
    }

    public static warn(message: string): void {
        if (this.logLevelInt <= this.LogLevelEnum.WARN) {
            this.writeMessage("WARN", message);
        }
    }

    public static error(message: string): void {
        if (this.logLevelInt <= this.LogLevelEnum.ERROR) {
            this.writeMessage("ERROR", message);
        }
    }

    public static writeMessage(loglevel: string, message: string): void {
        const dateObject = new Date();
        let output = dateObject.toISOString();
        output += " | " + loglevel;
        output += " | " + message;

        if (loglevel == "ERROR") {
            console.error(output);
        } else {
            console.log(output);
        }
    }
}
