FROM node:latest

COPY . /app
RUN npm install -g @vue/cli
RUN npm i -g @vue/cli-service-global
WORKDIR /app

RUN npm install

RUN npm run build

RUN npm install pm2 -g

CMD ["pm2-runtime", "index.js", "--", "--port=3435", "--folder=build"]