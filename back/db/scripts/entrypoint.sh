#!/bin/bash

# Set your PostgreSQL connection details
PG_USER="your_username"
PG_HOST="your_host"
PG_PORT="your_port"
PG_DATABASE="your_database"

# Set the path to your SQL script file
SQL_SCRIPT="/scripts/create-reactions.sql"

# Run SQL script using psql
# psql -U "$POSTGRES_USER" -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -d "$POSTGRES_DB" -W -f "$SQL_SCRIPT" <<EOF
# $PG_PASSWORD
# EOF

echo $PG_PASSWORD