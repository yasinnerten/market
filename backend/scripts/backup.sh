#!/bin/bash

# Configuration
BACKUP_DIR="/backups"
POSTGRES_HOST="market-postgres-1"
POSTGRES_PORT="5432"
POSTGRES_DB="market"
POSTGRES_USER="postgres"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql.gz"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform backup
pg_dump -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB | gzip > $BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

# Log backup completion
echo "Backup completed: $BACKUP_FILE" 