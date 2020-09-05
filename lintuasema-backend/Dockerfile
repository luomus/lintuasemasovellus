FROM python:latest

COPY . /app

WORKDIR /app

RUN pip install -r requirements.txt

ENV FLASK_APP lintuasemasovellus.py

ENTRYPOINT ["./boot.sh"]
