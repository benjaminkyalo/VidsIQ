FROM denoland/deno:bin-2.5.6 AS deno
FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=deno /deno /usr/local/bin/deno
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && useradd --uid 10001 --create-home converter && mkdir /data && chown converter:converter /data
COPY server.py .
USER converter
EXPOSE 8090
CMD ["uvicorn", "server:from_env", "--factory", "--host", "0.0.0.0", "--port", "8090", "--workers", "1", "--no-access-log"]