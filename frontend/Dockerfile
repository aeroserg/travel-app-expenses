
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

ENV NEXT_PUBLIC_API_URL=http://localhost:4000

CMD ["npm", "run", "start"]
