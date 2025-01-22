FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN  npm ci --omit=dev

COPY . .

EXPOSE  4000

CMD ["node", "index.js"]