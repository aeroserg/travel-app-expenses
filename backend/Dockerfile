
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

ENV MONGO_URI=mongodb://root:example@mongo:27017/travel-exp?authSource=admin
ENV PORT=4000

CMD ["npm", "run", "start"]
