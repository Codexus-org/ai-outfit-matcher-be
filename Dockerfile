FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm@latest 

RUN apk --no-cache add ca-certificates wget
RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub
RUN wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.28-r0/glibc-2.28-r0.apk
RUN apk add --no-cache --force-overwrite glibc-2.28-r0.apk

RUN npm install -g bun
RUN pnpm install

EXPOSE 8000

CMD [ "bun", "dev" ]

