# High Traffic Configuration Guide

## For Event Day: 50k-100k requests/second

### Summary of Changes Made

1. **Prisma Connection Pool**: Increased from default 10 to 55 per worker
   - Total connections: 18 workers × 55 = **990 connections**
   
2. **Rate Limiting**: Relaxed from 100 to 10,000 requests per 15 minutes per IP

3. **MongoDB URL**: Updated with optimized connection parameters

---

## CRITICAL: Nginx Changes Required

Update `/etc/nginx/sites-available/convocation` before event day:

```nginx
# Replace the rate limiting zones at the top with:
limit_req_zone $binary_remote_addr zone=api_limit:50m rate=500r/s;
limit_req_zone $binary_remote_addr zone=general_limit:50m rate=1000r/s;

# In the API location block, update burst:
location /api {
    limit_req zone=api_limit burst=1000 nodelay;
    
    # ... rest of config
}
```

### Run these commands:
```bash
# Edit nginx config
sudo nano /etc/nginx/sites-available/convocation

# Test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

## MongoDB Tuning Required

Edit `/etc/mongod.conf`:

```yaml
net:
  port: 27017
  bindIp: 127.0.0.1
  maxIncomingConnections: 5000  # Add this line

# Increase wiredTiger cache if you have RAM available
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 16  # Increase from 12 to 16GB if possible
```

Restart MongoDB:
```bash
sudo systemctl restart mongod
```

---

## System Kernel Tuning

Add to `/etc/sysctl.conf`:

```bash
# Network performance
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.tcp_fin_timeout = 15
net.ipv4.tcp_tw_reuse = 1
net.ipv4.ip_local_port_range = 1024 65535

# File handles
fs.file-max = 500000
```

Apply: `sudo sysctl -p`

---

## Pre-Event Checklist

- [ ] Update Nginx rate limits (increase significantly)
- [ ] Rebuild API with new Prisma config: `cd apps/api && bun run build`
- [ ] Restart API: `pm2 restart convocation-api`
- [ ] Increase MongoDB maxIncomingConnections
- [ ] Apply kernel tuning
- [ ] Monitor with: `mongosh --eval "db.serverStatus().connections"`

---

## Expected Connection Pool After Changes

| Component | Setting |
|-----------|---------|
| Workers | 18 |
| Connections per worker | 55 |
| **Total MongoDB connections** | ~990 |
| MongoDB available | 51,192 |
| **Capacity** | ✅ Sufficient |

---

## Monitoring Commands

```bash
# Check MongoDB connections in real-time
watch -n 1 'mongosh --quiet --eval "db.serverStatus().connections"'

# Check API worker status
pm2 monit

# Check nginx connections
watch -n 1 'ss -s'

# Check system resources
htop
```

---

## Emergency Rollback

If issues occur, revert rate limits in nginx:
```bash
sudo nano /etc/nginx/sites-available/convocation
# Change rates back to: rate=30r/s and burst=50
sudo systemctl reload nginx
```
