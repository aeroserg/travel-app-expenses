FROM node:20-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY .env .env.sample ./
COPY .prettierrc .gitignore .dockerignore ./

COPY jest.config.ts eslint.config.mjs ./

COPY src ./src
COPY test ./test

RUN chown -R appuser:appgroup /app
USER appuser

RUN npm run build

ENV MONGO_URI=mongodb://root:example@mongo:27017/travel-exp?authSource=admin
ENV PORT=4000

CMD ["npm", "run", "start"]
