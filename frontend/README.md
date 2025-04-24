frontend/
│── public/                      # Статические файлы (icons, manifest, service worker)
│   │── icons/                    # Иконки PWA
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │── manifest.json             # PWA манифест
│   │── sw.js                     # Service Worker (если используется PWA)
│── src/
│   ├── app/                     # App Router (Next.js 14+)
│   │   ├── layout.tsx            # Общий Layout
│   │   ├── page.tsx              # Главная страница
│   │   ├── dashboard/            # Страница Dashboard (группы и траты)
│   │   │   ├── layout.tsx         # Layout Dashboard
│   │   │   ├── page.tsx           # Главная страница дашборда
│   │   │   ├── group/             # Страница группы
│   │   │   │   ├── [id]/          # Динамический маршрут группы
│   │   │   │   │   ├── page.tsx   # Детали группы (участники, траты)
│   │   │   │   │   ├── expenses/  # CRUD трат в группе
│   │   │   │   │   │   ├── page.tsx
│   │   ├── auth/                  # Страницы авторизации
│   │   │   ├── login/page.tsx      # Логин
│   │   │   ├── register/page.tsx   # Регистрация
│   │   ├── profile/               # Страница профиля
│   │   │   ├── page.tsx            # Профиль пользователя
├── components/                 
│   ├── shared/                  # Общие UI-компоненты (используются везде)
│   │   ├── Header.tsx           # Хедер
│   │   ├── Sidebar.tsx          # Боковое меню
│   │   ├── Button.tsx           # Кастомные кнопки (если нужно)
│   │   ├── Loader.tsx           # Индикатор загрузки
│   │   ├── EmptyState.tsx       # Компонент пустого состояния (например, "Нет данных")
│   ├── dashboard/               # Компоненты, относящиеся только к Dashboard
│   │   ├── GroupCard.tsx        # Карточка группы путешествия
│   │   ├── ExpenseCard.tsx      # Карточка траты в группе
│   │   ├── GroupList.tsx        # Список групп пользователя
│   │   ├── ExpenseList.tsx      # Список трат в группе
│   │   ├── AddExpenseModal.tsx  # Модальное окно добавления траты
│   │   ├── AddGroupModal.tsx    # Модальное окно создания группы

│   ├── features/                  # Логика приложения (группы, траты, авторизация)
│   │   ├── groups.ts               # Логика работы с группами
│   │   ├── expenses.ts             # Логика работы с тратами
│   ├── hooks/                     # Кастомные хуки (IndexedDB, Service Workers)
│   │   ├── useIndexedDB.ts         # Работа с IndexedDB
│   │   ├── useSync.ts              # Фоновая синхронизация данных
│   ├── store/                     # Redux store
│   │   ├── index.ts                # Настройка Redux Store
│   │   ├── slices/                 # Redux Slices (стейт-менеджмент)
│   │   │   ├── groupSlice.ts       # Управление группами
│   │   │   ├── expenseSlice.ts     # Управление тратами
│   ├── services/                  # API-запросы (React Query)
│   │   ├── api.ts                  # Запросы на бэкенд
│   ├── utils/                     # Вспомогательные функции
│   │   ├── formatCurrency.ts       # Форматирование валют
│   │   ├── tokenUtils.ts           # Работа с токенами
│   ├── workers/                   # Service Workers
│   │   ├── serviceWorker.ts        # Регистрация Service Worker
│   ├── types/                     # Типы TypeScript
│   │   ├── expense.ts              # Типы для трат
│   │   ├── group.ts                # Типы для групп
│── .env                           # Переменные окружения (NEXT_PUBLIC_API_URL)
│── next.config.js                 # Конфигурация Next.js
│── package.json
│── tsconfig.json
│── dockerfile                     # Dockerfile для контейнеризации
