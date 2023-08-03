import {NotificationDestination} from "./NotificationDestination";
import {Logger} from "../utils/Logger";

export class NotificationProcessor {
    private static readonly ForTagNode: string = "for-tag";
    private static readonly DestinationsNode: string = "destinations";

    private readonly _forTag: string;
    private readonly _destinations: NotificationDestination[];


    constructor(objectToParse: any) {
        let forTagRaw = objectToParse[`${NotificationProcessor.ForTagNode}`];
        if (forTagRaw == null) {
            Logger.error(`Node ${NotificationProcessor.ForTagNode} not specified. Impossible to proceed`);
            process.exit(-1);
        }
        this._forTag = forTagRaw;

        let destinationsRaw = objectToParse[`${NotificationProcessor.DestinationsNode}`]
        if (destinationsRaw == null) {
            Logger.error(`Node ${NotificationProcessor.DestinationsNode} not specified. Impossible to proceed`);
            process.exit(-1);
        }

        this._destinations = [];
        for(let i=0; i < destinationsRaw.length; i++){
            let destinationRaw = destinationsRaw[i];
            let destination = new NotificationDestination(destinationRaw);

            // Check if the type was not skipped
            if (destination.type !== null) {
                this._destinations.push(destination);
            }

        }

        if (this._destinations.length == 0) {
            console.log(`For tag [${this._forTag}], there are no destinations defined, is that right?`);
        }
    }

    public logStructure(deepness: string): void {
        Logger.warn(`${deepness} For tag: ${this._forTag}`);

        this._destinations.forEach((destination) => {
            destination.logStructure(deepness + "   ");
        });
    }

    get forTag(): string {
        return this._forTag;
    }

    get destinations(): NotificationDestination[] {
        return this._destinations;
    }
}