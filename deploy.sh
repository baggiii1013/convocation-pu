#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}🚀 Convocation-PU Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}"

cd /home/appadmin/convocation-pu

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

echo -e "\n${YELLOW}🔄 Step 5: Reloading PM2 applications...${NC}"
pm2 reload ecosystem.config.cjs --update-env
echo -e "${GREEN}✓ PM2 reloaded${NC}"

echo -e "\n${YELLOW}⏳ Waiting for applications to stabilize...${NC}"
sleep 5

echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}📊 Application Status:${NC}"
echo -e "${BLUE}========================================${NC}"
pm2 status

echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}========================================${NC}"
