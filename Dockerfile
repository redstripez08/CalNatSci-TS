FROM node:14
WORKDIR /usr/app

# Install deps
COPY package*.json ./
COPY prisma prisma

RUN npm ci --only=production

# Bundle app
COPY dist dist

# Generate Prisma Client
RUN npx prisma generate

CMD [ "npm", "start" ]