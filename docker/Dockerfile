FROM node:16

WORKDIR /source

COPY package.json package.json

RUN npm install
COPY . . 
ENV NEXT_PUBLIC_AUTH_API = "https://auth.thinkmay.net"
ENV NEXT_PUBLIC_SIGNALING_URL = "wss://signaling.thinkmay.net/ws"
RUN npm run build

EXPOSE 3000

CMD npm run start