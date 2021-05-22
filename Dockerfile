FROM node:14

WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm ci --only=production

# Bundle app
COPY . .

# Generate Prisma Client and Database
ENV DATABASE_URL=sqlite:./db/Database.db
RUN npx prisma generate
RUN npx prisma migrate deploy --preview-feature

EXPOSE 80
CMD ["./docker-start.sh"]