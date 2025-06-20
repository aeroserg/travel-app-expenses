FROM node:20-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY .prettierrc .gitignore .dockerignore ./

COPY jest.config.ts eslint.config.mjs ./

COPY src ./src
COPY test ./test

RUN chown -R appuser:appgroup /app
USER appuser

RUN npm run build

ENV TELEGRAM_BOT_TOKEN=7860782185:AAG8wkkbcIx0Y00mqiRU8U2O1bet8DhGeUY
ENV MONGO_URI=mongodb://root:adjalbv&bskdf2Bk1BC3keJ!Jk13@mongo:27017/travel-exp?authSource=admin
ENV JWT_SECRET=BCI@udb2i&BKJHBR@YBKjB@3u2lpcvwpbfr3y2blcwIHBCIuy2evd2eyvdE
ENV PORT=4000


CMD ["npm", "run", "start"]
