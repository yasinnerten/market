#!/bin/bash

# Configuration with fixed paths
BACKUP_DIR="/app/backups"
POSTGRES_HOST="${POSTGRES_HOST:-market-postgres-1}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_DB="${POSTGRES_DB:-market}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/manual_backup_$DATE.sql.gz"

# Check if backup directory exists, if not create it
if [ ! -d "$BACKUP_DIR" ]; then
    echo "Creating backup directory..."
    mkdir -p $BACKUP_DIR
fi

# Perform backup
echo "Starting manual backup..."
if pg_dump -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB | gzip > $BACKUP_FILE; then
    echo "Backup completed successfully: $BACKUP_FILE"
else
    echo "Backup failed!"
    exit 1
fi

# Show backup file size
FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "Backup file size: $FILESIZE"

echo "Manual backup process completed" 