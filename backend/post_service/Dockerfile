FROM node:18

WORKDIR /app

COPY package*.json ./
# COPY ..dockerignore ./

RUN npm install

COPY . .

EXPOSE 3002

CMD ["node", "src/server.js"]
