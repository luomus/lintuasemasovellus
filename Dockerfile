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

ENTRYPOINT ["python"]

CMD ["lintuasemasovellus.py"]