backend/
│── src/
│   ├── auth/                     # 🔹 Модуль аутентификации
│   │   ├── auth.module.ts        
│   │   ├── auth.controller.ts    # ➜ `POST /auth/login`, `POST /auth/register`
│   │   ├── auth.service.ts
│   │   ├── auth.guard.ts         # ➜ Защита API
│   ├── users/                    # 🔹 Модуль пользователей (Профиль)
│   │   ├── users.module.ts
│   │   ├── users.controller.ts    # ➜ `GET /users/me`
│   │   ├── users.service.ts
│   │   ├── user.schema.ts        # ➜ Модель пользователя
│   ├── groups/                   # 🔹 Модуль групп (Путешествия)
│   │   ├── groups.module.ts
│   │   ├── groups.controller.ts   # ➜ `GET /groups`, `POST /groups`, `POST /groups/{id}/join`
│   │   ├── groups.service.ts
│   │   ├── group.schema.ts        # ➜ Модель группы
│   ├── expenses/                  # 🔹 Модуль трат
│   │   ├── expenses.module.ts
│   │   ├── expenses.controller.ts  # ➜ `GET /groups/{id}/expenses`, `POST /groups/{id}/expenses`
│   │   ├── expenses.service.ts
│   │   ├── expense.schema.ts       # ➜ Модель траты
│   ├── debts/                     # 🔹 Модуль долгов
│   │   ├── debts.module.ts
│   │   ├── debts.controller.ts     # ➜ `GET /groups/{id}/debts`
│   │   ├── debts.service.ts
│   │   ├── debt.schema.ts          # ➜ Модель долгов
│   ├── config/                     # 🔹 Конфигурация (MongoDB, JWT)
│   │   ├── jwt.config.ts
│   │   ├── database.config.ts
│   ├── middleware/                 # 🔹 Middleware (Защита токенов)
│   │   ├── token.middleware.ts      # ➜ Обновление токенов
│   ├── app.module.ts               # 🔹 Главный модуль приложения
│   ├── main.ts                     # 🔹 Точка входа
│── .env                            # 🔹 Переменные окружения (MongoDB, JWT_SECRET)
│── package.json                    
│── tsconfig.json                    
│── docker-compose.yml               # 🔹 Запуск MongoDB в контейнере
