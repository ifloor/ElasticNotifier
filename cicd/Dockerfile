FROM node:14

# Imutable stuff

ENV LOG_LEVEL=REPLACE_ME

ENV ROOT_CONFIG=REPLACE_ME_WITH_A_VALID_JSON_STRING


ENTRYPOINT [ "node", "application.js" ]

# Mutable stuff
WORKDIR /usr/src/app
COPY . .
