import {Logger} from "../../../utils/Logger";
import {MonitoringRecord} from "../../../elastic/MonitoringRecord";
import {MessageBuilder, Webhook} from "discord-webhook-node";

export class NDDiscord {
    private static readonly WebhookNode: string = "webhook-url";

    private readonly _webhookUrl: string;

    constructor(objectToParse: any) {

        let webhookRaw = objectToParse[`${NDDiscord.WebhookNode}`]
        if (webhookRaw == null) {
            Logger.error(`Node ${NDDiscord.WebhookNode} not specified. Impossible to proceed`);
            process.exit(-1);
        }
        this._webhookUrl = webhookRaw;
    }

    public notify(monitoringRecord: MonitoringRecord) {
        const hook = new Webhook(this._webhookUrl);
        Logger.info("info: " + JSON.stringify(monitoringRecord));

        const embed = new MessageBuilder();

        const title = monitoringRecord.getTitle();
        if (title != null) {
            embed.setTitle(title);
        }

        const author = monitoringRecord.getAuthor();
        if (author != null) {
            embed.setAuthor(author);
        }

        const messageUrl = monitoringRecord.getMessageUrl();
        if (messageUrl != null) {
            // embed.setUrl(messageUrl); for some reason, this triggers setUrl method cannot be found
        }

        const color = monitoringRecord.getColor();
        if (color != null) {
            embed.setColor(color);
        }

        const thumbnail = monitoringRecord.getThumbnail();
        if (thumbnail != null) {
            embed.setThumbnail(thumbnail);
        }

        const description = monitoringRecord.getDescription();
        if (description != null) {
            embed.setDescription(description);
        }

        const image = monitoringRecord.getImage();
        if (image != null) {
            embed.setImage(image);
        }

        const footer = monitoringRecord.getFooter();
        if (footer != null) {
            embed.setFooter(footer);
        }

        embed.setTimestamp();

        hook.send(embed)
            .then(_ => {
                Logger.info("Notification successfully sent");
            }).catch(reason => {
                Logger.error(`Error when sending discord's notification: ${reason}`);
            });
    }

    public logStructure(deepness: string): void {
        Logger.warn(`${deepness} Webhook url: ${this._webhookUrl}`);
    }

    get webhookUrl(): string {
        return this._webhookUrl;
    }
}