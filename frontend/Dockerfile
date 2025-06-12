
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

ENV NEXT_PUBLIC_API_URL=http://0.0.0.0:4000

CMD ["npm", "run", "start"]
