FROM node:20 AS builder

COPY /frontend /front

WORKDIR /front

RUN npm install

COPY . .

RUN npm run build

FROM python:3.12

RUN mkdir -p /opt/oracle

WORKDIR /opt/oracle

RUN apt-get update && apt-get install -y libaio1 wget unzip \
        && wget https://download.oracle.com/otn_software/linux/instantclient/19800/instantclient-basiclite-linux.x64-19.8.0.0.0dbru.zip \
        && unzip instantclient-basiclite-linux.x64-19.8.0.0.0dbru.zip \
        && rm -f instantclient-basiclite-linux.x64-19.8.0.0.0dbru.zip \
        && echo /opt/oracle/instantclient_19_8 > /etc/ld.so.conf.d/oracle-instantclient.conf \
        && ldconfig

COPY /lintuasema-backend /back

COPY --from=builder /front/build/ /back/build/

WORKDIR /back

RUN pip install -r requirements.txt

ENTRYPOINT ["flask"]

CMD ["run", "--host=0.0.0.0", "--port=3000"]
