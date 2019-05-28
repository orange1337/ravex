FROM node:10.15.3

ARG PORT=8088
ENV PORT=${PORT}

ARG CONFIG_NET=production
ENV CONFIG_NET=${CONFIG_NET}

RUN apt-get update

WORKDIR /home/ravex
COPY . /home/ravex

RUN npm install -g pm2
RUN npm install -g @angular/cli@7.1.0
RUN cd /home/ravex && npm install
RUN cd /home/ravex && npm run postinstall
RUN cd /home/ravex/server && npm install
RUN cd /home/ravex && ng build --configuration=${CONFIG_NET}

#CMD ["pm2-runtime", "/home/ravex/server/ecosystem.config.js", "--web"]

CMD ["pm2-runtime", "/home/ravex/server/server.js"]

EXPOSE ${PORT}
