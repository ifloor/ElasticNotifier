This tool works watching a pre-defined index on elastic, when new data appears on this index, notifications are triggered (ex, Discord).

To this tool works it needs the environment variable: ROOT_CONFIG
The value should be a String with a valid json text. This JSON should be according this definition:

```
{
	elastic-config: ElasticConfig,
	watch-index: String, // It will read this index on elastic, ex: monitoring-index
	watch-seconds-interval: number, // The interval between queries on elastic
	notification-processors: [NotificationProcessor]
}
```
Where the complex objects defined above, are as follow:
```
ElasticConfig: {
	elastic-server: String, // Full server url, ex: https://url.com:9200
	elastic-user: String,  // User to do the login on elasticsearch
	elastic-user-password: String, // Password for the above user
}

NotificationProcessor: {
	for-tag: String, // value that when found on 'tag' field, will trigger this processor
	destinations: [NotificationDestination]
}

NotificationDestinationType: ["Discord"]

// When DISCORD type
NotificationDestination: {
    type: DISCORD,
    webhook-url: String
}
    
// When MICROSOFT_TEAMS type
NotificationDestination: {
    type: MICROSOFT_TEAMS,
    webhook-url: String
}

// When SMTP_EMAIL type
NotificationDestination: {
    type: SMTP_EMAIL,
    host: String,
    port: number,
    auth-user: String,
    auth-pass: String,
    from-email: String,
    destination-email: String
}

// When HTTP_REQUEST type
NotificationDestination: {
    type: HTTP_REQUEST,
    url: String,
    request-method: String,
    add-header-to-request: JSon // {'header1': 'hvalue1'}
}



// When writing the message on elastic, the below fields can be specified on the elastic object that will be watched
//  title: String,
//  author: String,
//  message-url: String,
//  color: String,
//  thumbnail: String,
//  description: String,
//  image: String,
//  footer: String
// The meaning of these fields are based on: https://www.npmjs.com/package/discord-webhook-node
}
```