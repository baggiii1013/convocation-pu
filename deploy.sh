#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DEPLOY_PATH="/home/appadmin/convocation-pu"
BACKUP_PATH="/home/appadmin/backups"

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}🚀 Convocation-PU Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}"

cd $DEPLOY_PATH

# Create backup before deployment
echo -e "\n${YELLOW}💾 Step 0: Creating pre-deployment backup...${NC}"
BACKUP_DIR="$BACKUP_PATH/$(date +%Y%m%d_%H%M%S)_manual"
mkdir -p "$BACKUP_DIR"

if [ -d "apps/api/dist" ]; then
  cp -r "apps/api/dist" "$BACKUP_DIR/api-dist"
fi
if [ -d "apps/web/.next" ]; then
  cp -r "apps/web/.next" "$BACKUP_DIR/web-next"
fi
git rev-parse HEAD > "$BACKUP_DIR/commit_hash"

# Clean old backups (keep last 5)
cd "$BACKUP_PATH"
ls -dt */ 2>/dev/null | tail -n +6 | xargs -r rm -rf
cd $DEPLOY_PATH

echo -e "${GREEN}✓ Backup created at $BACKUP_DIR${NC}"

echo -e "\n${YELLOW}📥 Step 1: Pulling latest changes...${NC}"
git fetch origin master
git reset --hard origin/master
echo -e "${GREEN}✓ Code updated${NC}"

echo -e "\n${YELLOW}📦 Step 2: Installing dependencies...${NC}"
bun install --frozen-lockfile
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo -e "\n${YELLOW}🔨 Step 3: Building API...${NC}"
cd apps/api
bun run build
cd ../..
echo -e "${GREEN}✓ API built${NC}"

echo -e "\n${YELLOW}🔨 Step 4: Building Web...${NC}"
cd apps/web
bun run build
cd ../..
echo -e "${GREEN}✓ Web built${NC}"

echo -e "\n${YELLOW}🔄 Step 5: Reloading PM2 applications (zero-downtime)...${NC}"
pm2 reload ecosystem.config.cjs --update-env
echo -e "${GREEN}✓ PM2 reloaded${NC}"

echo -e "\n${YELLOW}⏳ Waiting for applications to stabilize...${NC}"
sleep 5

# Verify processes are online
API_STATUS=$(pm2 jlist | jq -r '.[] | select(.name == "convocation-api") | .pm2_env.status')
WEB_STATUS=$(pm2 jlist | jq -r '.[] | select(.name == "convocation-web") | .pm2_env.status')

echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}📊 Application Status:${NC}"
echo -e "${BLUE}========================================${NC}"
pm2 status

if [ "$API_STATUS" != "online" ] || [ "$WEB_STATUS" != "online" ]; then
  echo -e "\n${RED}❌ One or more services failed to start!${NC}"
  echo -e "${RED}API Status: $API_STATUS${NC}"
  echo -e "${RED}Web Status: $WEB_STATUS${NC}"
  echo -e "\n${YELLOW}🔙 Rolling back to previous version...${NC}"
  
  if [ -f "$BACKUP_DIR/commit_hash" ]; then
    PREV_COMMIT=$(cat "$BACKUP_DIR/commit_hash")
    git reset --hard "$PREV_COMMIT"
    
    if [ -d "$BACKUP_DIR/api-dist" ]; then
      rm -rf apps/api/dist
      cp -r "$BACKUP_DIR/api-dist" apps/api/dist
    fi
    
    if [ -d "$BACKUP_DIR/web-next" ]; then
      rm -rf apps/web/.next
      cp -r "$BACKUP_DIR/web-next" apps/web/.next
    fi
    
    pm2 reload ecosystem.config.cjs --update-env
    echo -e "${GREEN}✓ Rollback completed${NC}"
  fi
  
  exit 1
fi

echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}========================================${NC}"

