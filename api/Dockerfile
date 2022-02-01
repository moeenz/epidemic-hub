FROM python:3.9.10-slim

ARG poetryversion=1.1.12

ENV POETRY_VERSION=${poetryversion} \
    PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=90

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    gcc \
    libc-bin \
    python-dev

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

RUN pip install "poetry==${POETRY_VERSION}"

WORKDIR /www/api

COPY ./poetry.lock ./pyproject.toml /www/api/
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

COPY . .
