FROM node:latest

COPY . /app

RUN npm i -g @angular/cli

WORKDIR /app
RUN npm install

RUN npm run build

RUN npm run package:elements

RUN npm install pm2 -g

CMD ["pm2-runtime", "index.js", "--", "--folder=build"]