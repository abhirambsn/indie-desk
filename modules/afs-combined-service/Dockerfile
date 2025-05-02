FROM python:3.12-slim AS base

WORKDIR /app

COPY ./modules/afs-combined-service/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
COPY ./modules/afs-combined-service .

RUN chmod +x ./run.sh
EXPOSE 3000

CMD ["./run.sh"]
