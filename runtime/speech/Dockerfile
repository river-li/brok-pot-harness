FROM python:3.12-slim-bookworm@sha256:d5ae74acb8026b32a2f6deea45003c5bd4e2880700c19c44bda54670ad3eff90
ENV PYTHONUNBUFFERED=1 PIP_DISABLE_PIP_VERSION_CHECK=1 HF_HUB_DISABLE_TELEMETRY=1 DO_NOT_TRACK=1 HF_HOME=/models/.hf
WORKDIR /app
COPY requirements.lock ./requirements.lock
RUN --mount=type=cache,target=/root/.cache/pip pip install --only-binary=:all: --no-binary=jieba -r requirements.lock
RUN pip check
COPY model.json model.py tts-model.json tts.py server.py ./
EXPOSE 8000
CMD ["python", "server.py"]
