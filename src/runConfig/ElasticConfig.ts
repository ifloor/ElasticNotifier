import {Logger} from "../utils/Logger";

export class ElasticConfig {
    private static readonly ElasticServerNode: string = "elastic-server";
    private static readonly ElasticUserNode: string = "elastic-user";
    private static readonly ElasticUserPasswordNode: string = "elastic-user-password";

    private readonly _elasticServer: string;
    private readonly _elasticUser: string;
    private readonly _elasticUserPassword: string;


    constructor(objectToParse: any) {
        let serverRaw = objectToParse[`${ElasticConfig.ElasticServerNode}`];
        if (serverRaw == null) {
            Logger.error(`Node ${ElasticConfig.ElasticServerNode} not specified. Impossible to proceed`);
            process.exit(-1);
        }
        this._elasticServer = serverRaw;

        let userRaw = objectToParse[`${ElasticConfig.ElasticUserNode}`];
        if (userRaw == null) {
            Logger.error(`Node ${ElasticConfig.ElasticUserNode} not specified. Impossible to proceed`);
            process.exit(-1);
        }
        this._elasticUser = userRaw;

        let passwordRaw = objectToParse[`${ElasticConfig.ElasticUserPasswordNode}`];
        if (passwordRaw == null) {
            Logger.error(`Node ${ElasticConfig.ElasticUserPasswordNode} not specified. Impossible to proceed`);
            process.exit(-1);
        }
        this._elasticUserPassword = passwordRaw;
    }

    public logStructure(deepness: string): void {
        Logger.warn(`${deepness} Elastic server: ${this._elasticServer}`);
        Logger.warn(`${deepness} Elastic user: ${this._elasticUser}`);
        Logger.warn(`${deepness} Elastic pass: ${this.obfuscatePassword(this._elasticUserPassword)}`);
    }

    private obfuscatePassword(password: string): string {
        let result = "";

        for(let i=0; i < password.length; i++) {
            result = result + "*";
        }

        return result;
    }

    get elasticServer(): string {
        return this._elasticServer;
    }

    get elasticUser(): string {
        return this._elasticUser;
    }

    get elasticUserPassword(): string {
        return this._elasticUserPassword;
    }
}