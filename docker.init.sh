#!/usr/bin/env bash

npx envsub env.template .env

exec "$@"
