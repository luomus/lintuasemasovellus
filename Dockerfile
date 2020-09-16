FROM node:latest AS builder

COPY /frontend /front

WORKDIR /front

RUN npm install

COPY . .

RUN npm run build

FROM python:latest

COPY /lintuasema-backend /back

COPY --from=builder /front/build/ /back/build/

WORKDIR /back

RUN pip install -r requirements.txt

ENTRYPOINT ["flask"]

CMD ["run", "--host=0.0.0.0", "--port=3000"]