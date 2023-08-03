import {Client} from "@elastic/elasticsearch";
import {ElasticConfig} from "../runConfig/ElasticConfig";
import {Logger} from "../utils/Logger";

export class ElasticClient {

    private readonly _elasticClient: Client;

    constructor(elasticConfig: ElasticConfig) {
        this._elasticClient = new Client({
            node: elasticConfig.elasticServer,
            auth: {
                username: elasticConfig.elasticUser,
                password: elasticConfig.elasticUserPassword
            }
        });
    }

    get elasticClient(): Client {
        return this._elasticClient;
    }
}