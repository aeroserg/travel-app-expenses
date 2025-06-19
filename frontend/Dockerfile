
FROM node:20-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY next.config.ts .
COPY jest.config.js .
COPY jest.setup.ts .
COPY check-coverage.js .
COPY .env .
COPY .gitignore .
COPY .dockerignore .
COPY .eslintrc.json .
COPY eslint.config.mjs .

COPY src ./src
COPY public ./public

RUN npm run build

RUN chown -R appuser:appgroup /app

USER appuser

ENV NEXT_PUBLIC_API_URL=http://158.160.44.174.nip.io:30701/api

CMD ["npm", "run", "start"]
