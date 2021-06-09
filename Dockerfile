FROM node:14
WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm ci --production

# Bundle app
COPY . .

# Generate Prisma Client and Database
RUN npx prisma generate

EXPOSE 80
CMD [ "npm", "start" ]