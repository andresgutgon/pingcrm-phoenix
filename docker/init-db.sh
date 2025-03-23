#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    SELECT 'CREATE DATABASE pingcrm_development'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pingcrm_development')\gexec

    SELECT 'CREATE DATABASE pingcrm_test'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pingcrm_test')\gexec

    SELECT 'CREATE DATABASE pingcrm_fake_production'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pingcrm_fake_production')\gexec
EOSQL

