import {Logger} from "../utils/Logger";
import {MonitoringRecord} from "../elastic/MonitoringRecord";
import {IncomingWebhook} from "ms-teams-webhook";
import moment from "moment";

export class NDMicrosoftTeams {
    private static readonly WebhookNode: string = "webhook-url";

    private readonly _webhookUrl: string;
    private readonly _incomingWebhook: IncomingWebhook;

    constructor(objectToParse: any) {

        let webhookRaw = objectToParse[`${NDMicrosoftTeams.WebhookNode}`]
        if (webhookRaw == null) {
            Logger.error(`Node ${NDMicrosoftTeams.WebhookNode} not specified. Impossible to proceed`);
            process.exit(-1);
        }
        this._webhookUrl = webhookRaw;
        this._incomingWebhook = new IncomingWebhook(this._webhookUrl);
    }

    public notify(monitoringRecord: MonitoringRecord) {

        let title = monitoringRecord.getTitle();
        if (title == null) {
            title = "N/A";
        }

        let author = monitoringRecord.getAuthor();
        if (author == null) {
            author = "N/A";
        }

        let messageUrl = monitoringRecord.getMessageUrl();
        if (messageUrl == null) {
            messageUrl = "https://google.com";
        }

        let color = monitoringRecord.getColor();
        if (color == null) {
            color = 0x0078D7;
        }

        let thumbnail = monitoringRecord.getThumbnail();
        if (thumbnail == null) {
            // embed.setThumbnail(thumbnail);
        }

        let description = monitoringRecord.getDescription();
        if (description == null) {
            description = "N/A";
        }

        let image = monitoringRecord.getImage();
        if (image == null) {
            image = "https://i2.wp.com/oraex.com.br/wp-content/uploads/2019/04/img_Elasticsearch_interna.png";
        }

        let footer = monitoringRecord.getFooter();
        if (footer == null) {
            footer = "";
        }

        const notificationText = `${description}\n-----------\n${footer}`;
        const formattedDate: string = moment().format("DD/MM/YY, HH:mm");

        this._incomingWebhook.send(JSON.stringify({
            "@type": "MessageCard",
            "@context": "https://schema.org/extensions",
            "summary": "Issue 176715375",
            "themeColor": color,
            "title": title,
            "sections": [
                {
                    "activityTitle": author,
                    "activitySubtitle": formattedDate,
                    "activityImage": image,
                    "text": notificationText
                }
            ]
        })).then((incomingWHResult) => {
            Logger.info(`Result when sending on MT-Webhook: ${incomingWHResult?.text}`);

        }).catch((reason) => {
            Logger.error(`Error when sending microsoft webhook: ${JSON.stringify(reason)}`)
        });
    }

    public logStructure(deepness: string): void {
        Logger.warn(`${deepness} Webhook url: ${this._webhookUrl}`);
    }

    get webhookUrl(): string {
        return this._webhookUrl;
    }
}