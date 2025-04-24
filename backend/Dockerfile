# Используем Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm install

# Копируем весь код
COPY . .

# Собираем NestJS
RUN npm run build

# Устанавливаем переменные окружения
ENV MONGO_URI=mongodb://root:example@mongo:27017/travel-exp?authSource=admin
ENV JWT_SECRET=my_super_secret_key
ENV PORT=4000

# Запускаем сервер
CMD ["npm", "run", "start"]
