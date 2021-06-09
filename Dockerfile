FROM node:14
WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm ci --production

# Bundle app
COPY . .

# Generate Prisma Client and Database
ENV DATABASE_URL=sqlite:./db/Database.db PORT=80
RUN npx prisma generate
RUN npx prisma migrate deploy 

EXPOSE 80
CMD [ "npm", "start" ]