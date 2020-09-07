FROM python:latest

COPY ./lintuasema-backend /app

WORKDIR /app

RUN pip install -r requirements.txt

ENTRYPOINT ["python"]

CMD ["lintuasemasovellus.py"]