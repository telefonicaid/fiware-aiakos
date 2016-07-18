#!/bin/bash

#Desription: Backup of keys
#Author: Telefonica I+D
#Version 1.0


TIME=`date +%b-%d-%y`
FILENAME=backup-$TIME.tar.gz
SRCDIR=/opt/fiware/fiware-aiakos/lib/public/keys
DESDIR=/data/fiware/fiware-aiakos.bk/            # Destination of backup file.
mkdir -p $DESDIR

# Make backup using tar.
tar cpzf $DESDIR/$FILENAME $SRCDIR
cd $DESDIR

# Find and delete old backups.
find . -name 'backup-*' -mtime +2 -delete

echo "Backup finished"
