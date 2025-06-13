
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

ENV NEXT_PUBLIC_API_URL=http://158.160.44.174.nip.io:30701/api

CMD ["npm", "run", "start"]
