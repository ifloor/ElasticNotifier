import {Logger} from "../../../utils/Logger";
import {MonitoringRecord} from "../../../elastic/MonitoringRecord";

const jq = require("node-jq")

export class NTAJQ {
    private static readonly TextSelectionStartTagNode: string = "text-selection-start-tag";
    private static readonly TextSelectionEndTagNode: string = "text-selection-end-tag";
    private static readonly JqTransformationExpressionsNode: string = "jq-transformation-expressions";
    private static readonly JqTransformationIsRaw: string = "jq-transformation-is-raw";

    private readonly _textSelectionStartTag: string;
    private readonly _textSelectionEndTag: string;
    private readonly _jqTransformationExpressions: string[];
    private readonly _jqIsRaw: boolean = false;

    constructor(objectToParse: any) {
        {
            let textSelectionStartTagRaw = objectToParse[`${NTAJQ.TextSelectionStartTagNode}`]
            if (textSelectionStartTagRaw == null) {
                Logger.error(`Node ${NTAJQ.TextSelectionStartTagNode} not specified. Impossible to proceed`);
                process.exit(-1);
            }
            this._textSelectionStartTag = textSelectionStartTagRaw
        }
        {
            let textSelectionEndTagRaw = objectToParse[`${NTAJQ.TextSelectionEndTagNode}`]
            if (textSelectionEndTagRaw == null) {
                Logger.error(`Node ${NTAJQ.TextSelectionEndTagNode} not specified. Impossible to proceed`);
                process.exit(-1);
            }
            this._textSelectionEndTag = textSelectionEndTagRaw
        }
        {
            let jqTransformationExpressionsRaw = objectToParse[`${NTAJQ.JqTransformationExpressionsNode}`]
            if (jqTransformationExpressionsRaw === null) {
                Logger.error(`Node ${NTAJQ.JqTransformationExpressionsNode} not specified. Impossible to proceed`);
                process.exit(-1);
            }

            this._jqTransformationExpressions = [];
            for (let i = 0; i < jqTransformationExpressionsRaw.length; i++) {
                let jqTransformationExpression = jqTransformationExpressionsRaw[i]

                // Check if the type was not skipped
                if (jqTransformationExpression !== null) {
                    this._jqTransformationExpressions.push(jqTransformationExpression);
                }
            }

            if (this._jqTransformationExpressions.length == 0) {
                Logger.warn(`For tag [${this._jqTransformationExpressions}], there are no jq expressions defined, is that right?`);
            }
        }
        {
            let isRaw = objectToParse[`${NTAJQ.JqTransformationIsRaw}`]
            if (isRaw !== null && isRaw.lowercase === "true") {
                this._jqIsRaw = true
            }
        }

    }

    public async adjust(monitoringRecord: MonitoringRecord): Promise<MonitoringRecord> {

        const title = monitoringRecord.getTitle()
        let titleMutated = title
        if (title !== null) titleMutated = await this.tryToAdjust(title)

        const author = monitoringRecord.getAuthor()
        let authorMutated = author
        if (author !== null) authorMutated = await this.tryToAdjust(author)

        const messageUrl = monitoringRecord.getMessageUrl()
        let messageUrlMutated = messageUrl
        if (messageUrl !== null) messageUrlMutated = await this.tryToAdjust(messageUrl)

        const thumbnail = monitoringRecord.getThumbnail()
        let thumbnailMutated = thumbnail
        if (thumbnail !== null) thumbnailMutated = await this.tryToAdjust(thumbnail)

        const description = monitoringRecord.getDescription()
        let descriptionMutated = description
        if (description !== null) descriptionMutated = await this.tryToAdjust(description)

        const image = monitoringRecord.getImage()
        let imageMutated = image
        if (image !== null) imageMutated = await this.tryToAdjust(image)

        const footer = monitoringRecord.getFooter()
        let footerMutated = footer
        if (footer !== null) footerMutated = await this.tryToAdjust(footer)

        if (title !== titleMutated || author !== authorMutated || messageUrl !== messageUrlMutated || thumbnail !== thumbnailMutated ||
          description !== descriptionMutated || image !== imageMutated || footer !== footerMutated
        ) {
            return MonitoringRecord.fromProperties(monitoringRecord.getIndex(), monitoringRecord.getTimestamp(), monitoringRecord.getTag(),
              titleMutated, authorMutated, messageUrlMutated, monitoringRecord.getColor(), thumbnailMutated, descriptionMutated,
              imageMutated, footerMutated
            )
        } else {
            return monitoringRecord
        }
    }

    private async tryToAdjust(value: string): Promise<string> {
        let outString = value
        let foundIndex = outString.indexOf(this._textSelectionStartTag)
        while (foundIndex >= 0) {
            let searchingEndString = outString.substr(foundIndex)
            let endingIndex = searchingEndString.indexOf(this._textSelectionEndTag)
            if (endingIndex < 0) { // Didn't find ending, nothing to do really
                Logger.warn(`Able to find start string [${this._textSelectionStartTag}], but no ending string [${this._textSelectionEndTag}] over text: [${value}]`)
                break
            }

            const stringToParse = searchingEndString.substring(this._textSelectionStartTag.length, endingIndex)
            const parseOutput = await this.tryToApply(stringToParse)
            outString = outString.replace(`${this._textSelectionStartTag}${stringToParse}${this._textSelectionEndTag}`, parseOutput)

            // Do another search to try to replace in loop
            foundIndex = outString.indexOf(this._textSelectionStartTag)
        }

        return outString
    }

    private async tryToApply(possibleJSon: string): Promise<string> {
        let returningString = possibleJSon
        try {
            for (let jqTransformationExpression of this._jqTransformationExpressions) {
                let result = await this.tryToApplySpecificExpression(returningString, jqTransformationExpression)
                if (result !== null) returningString = result
            }
        } catch (exception) {
            Logger.warn(`Exception when running jq: ${JSON.stringify(exception)}`)
        }

        return returningString
    }

    private async tryToApplySpecificExpression(possibleJSon: string, expression: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            jq.run(expression, possibleJSon, {input: 'string', raw: this._jqIsRaw }).then((value: string) => {
                resolve(value)
            }).catch((reason: any) => {
                Logger.error(`When running JQ Got exception: ${reason}`)
                resolve(null)
            })
        })
    }

    public logStructure(deepness: string): void {
        Logger.warn(`${deepness} textSelectionStartTag: ${this._textSelectionStartTag}`);
        Logger.warn(`${deepness} textSelectionEndTag: ${this._textSelectionEndTag}`);
        Logger.warn(`${deepness} jqTransformationExpressions: ${this._jqTransformationExpressions}`);
    }
}