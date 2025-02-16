#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    SELECT 'CREATE DATABASE coffee_pitch_development'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'coffee_pitch_development')\gexec

    SELECT 'CREATE DATABASE coffee_pitch_test'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'coffee_pitch_test')\gexec
EOSQL

