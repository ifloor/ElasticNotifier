export class MonitoringRecord {
    private readonly anyData: any;

    constructor(anyIndex: any) {
        this.anyData = anyIndex;
    }

    public static fromProperties(
      index: string | null,
      timestamp: string | null,
      tag: string | null,
      title: string | null,
      author: string | null,
      messageUrl: string | null,
      color: number | null,
      thumbnail: string | null,
      description: string | null,
      image: string | null,
      footer: string | null,
    ): MonitoringRecord {
        return new MonitoringRecord(
          {
              '_index': index,
              '_source': {
                  '@timestamp': timestamp,
                  'tag': tag,
                  'title': title,
                  'author': author,
                  'message-url': messageUrl,
                  'color': color,
                  'thumbnail': thumbnail,
                  'description': description,
                  'image': image,
                  'footer': footer,
              }
          }
        )
    }

    public getIndex(): string {
        return this.anyData['_index'];
    }

    public getTimestamp(): string {
        return this.anyData['_source']['@timestamp'];
    }

    public getSource(): string {
        return this.anyData['_source'];
    }

    public getTag(): string | null {
        let tag = this.anyData['_source']['tag'];
        if (tag === undefined || tag == null) {
            return null;
        } else {
            return tag;
        }
    }

    public getTitle(): string | null {
        let title = this.anyData['_source']['title'];
        if (title === undefined || title == null) {
            return null;
        } else {
            return title;
        }
    }

    public getAuthor(): string | null {
        let author = this.anyData['_source']['author'];
        if (author === undefined || author == null) {
            return null;
        } else {
            return author;
        }
    }

    public getMessageUrl(): string | null {
        let messageUrl = this.anyData['_source']['message-url'];
        if (messageUrl === undefined || messageUrl == null) {
            return null;
        } else {
            return messageUrl;
        }
    }

    public getColor(): number | null {
        let color = this.anyData['_source']['color'];
        if (color === undefined || color == null) {
            return null;
        } else {
            return color;
        }
    }

    public getThumbnail(): string | null {
        let thumbnail = this.anyData['_source']['thumbnail'];
        if (thumbnail === undefined || thumbnail == null) {
            return null;
        } else {
            return thumbnail;
        }
    }

    public getDescription(): string | null {
        let description = this.anyData['_source']['description'];
        if (description === undefined || description == null) {
            return null;
        } else {
            return description;
        }
    }

    public getImage(): string | null {
        let image = this.anyData['_source']['image'];
        if (image === undefined || image == null) {
            return null;
        } else {
            return image;
        }
    }

    public getFooter(): string | null {
        let footer = this.anyData['_source']['footer'];
        if (footer === undefined || footer == null) {
            return null;
        } else {
            return footer;
        }
    }
}