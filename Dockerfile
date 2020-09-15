FROM node:latest

COPY ./frontend /app

WORKDIR /app

RUN npm install

COPY . .

RUN npm run build

FROM python:latest

COPY ./lintuasema-backend /app

WORKDIR /app

RUN pip install -r requirements.txt

ENTRYPOINT ["flask"]

CMD ["run", "--host=0.0.0.0", "--port=3000"]