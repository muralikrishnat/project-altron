FROM keymetrics/pm2:latest


COPY . /public
COPY ./index.js /
WORKDIR /

EXPOSE 5201

CMD [ "node", "index.js", "--port=5201", "--folder=public"]