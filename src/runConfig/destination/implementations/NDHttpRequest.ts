import {Logger} from "../../../utils/Logger";
import {MonitoringRecord} from "../../../elastic/MonitoringRecord";
import axios from "axios";

const https = require('https');

export class NDHttpRequest {
    private static readonly Url: string = "url";
    private static readonly RequestMethod: string = "request-method";
    private static readonly AddHeaderToRequest: string = "add-header-to-request";

    private readonly _url: string;
    private readonly _requestMethod: string;
    private readonly _addHeaderToRequest: string;

    constructor(objectToParse: any) {
        {
            let urlRaw = objectToParse[`${NDHttpRequest.Url}`];
            if (urlRaw == null) {
                Logger.error(`Node ${NDHttpRequest.Url} not specified. Impossible to proceed`);
                process.exit(-1);
            }
            this._url = urlRaw;
        }
        {
            let requestMethodRaw = objectToParse[`${NDHttpRequest.RequestMethod}`];
            if (requestMethodRaw == null) {
                Logger.error(`Node ${NDHttpRequest.RequestMethod} not specified. Impossible to proceed`);
                process.exit(-1);
            }
            this._requestMethod = requestMethodRaw;
        }
        {
            let addHeaderToRequestMethodRaw = objectToParse[`${NDHttpRequest.AddHeaderToRequest}`];
            if (addHeaderToRequestMethodRaw == null) {
                Logger.error(`Node ${NDHttpRequest.AddHeaderToRequest} not specified. Impossible to proceed`);
                process.exit(-1);
            }
            this._addHeaderToRequest = addHeaderToRequestMethodRaw;
        }
    }

    public notify(monitoringRecord: MonitoringRecord) {
        let title = monitoringRecord.getTitle();
        if (title == null) {
            title = "N/A";
        }

        if (this._requestMethod.toLowerCase() === "get") {
            this.doGet();
        } else if (this._requestMethod.toLowerCase() === "post") {
            this.doPost(title);
        }
    }

    private doGet() {
        axios.get("").then(value => {
            Logger.info(`Did get request and answer is: ${value}`);
        }).catch( reason => {
            Logger.warn(`Error on get request: ${JSON.stringify(reason)}`)
        });
    }

    private doPost(title: String) {
        const body = {
            title: title
        }

        let headers = {};
        try {
            headers = JSON.parse(this._addHeaderToRequest)
        } catch (reason) {
            Logger.warn(`Error when parsing headers for http request: Headers as string -> ${this._addHeaderToRequest} - reason: ${JSON.stringify(reason)}`);
        }

        axios.post(this._url, body, {headers: headers}).then((response) => {
            Logger.info(`Got response: ${JSON.stringify(response)}`);
        }).catch(reason => {
            Logger.warn(`Got error calling request: Reason: ${JSON.stringify(reason)}`);
        });
    }

    public logStructure(deepness: string): void {
        Logger.warn(`${deepness} Url: ${this._url}`);
        Logger.warn(`${deepness} RequestMethod: ${this._requestMethod}`);
        Logger.warn(`${deepness} AddHeaderToRequest: ${this._addHeaderToRequest}`);
    }
}