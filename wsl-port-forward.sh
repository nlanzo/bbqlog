#!/bin/bash
# Port forwarding script for WSL2 to Windows PostgreSQL
# Run this script in WSL2 to forward port 5432 to Windows localhost

WINDOWS_HOST=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}')
echo "Forwarding WSL port 5432 to Windows host $WINDOWS_HOST:5432"

# Use netsh on Windows to set up port forwarding
# Note: This requires running from Windows PowerShell as Administrator:
# netsh interface portproxy add v4tov4 listenport=5432 listenaddress=0.0.0.0 connectport=5432 connectaddress=127.0.0.1

echo ""
echo "To set up port forwarding, run this in Windows PowerShell (as Administrator):"
echo "netsh interface portproxy add v4tov4 listenport=5432 listenaddress=0.0.0.0 connectport=5432 connectaddress=127.0.0.1"
echo ""
echo "Then use localhost in your DATABASE_URL:"
echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/bbqlog_db?schema=public\""

