FROM node:latest

COPY ./frontend /app

WORKDIR /app

RUN npm install

RUN npm run build

COPY . .

FROM python:latest

COPY ./lintuasema-backend /app

WORKDIR /app

RUN pip install -r requirements.txt

ENTRYPOINT ["flask"]

CMD ["run", "--host=0.0.0.0", "--port=5000"]