FROM node:alpine AS runner

WORKDIR /app

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
