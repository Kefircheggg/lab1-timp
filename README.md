# lab1-timp

Лабораторная работа №1 по дисциплине «Технологии и методы программирования» (НГТУ, кафедра защиты информации). Вариант 19 — «Безопасность в образовательных учреждениях».

Журнал инцидентов безопасности в школах, лицеях, колледжах и вузах: SPA на React с REST API на json-server. Реализованы CRUD-операции, клиентская маршрутизация, валидация форм, обработка ошибок и страница 404.

Развёрнутая версия: http://165.232.65.84/

## Стек

- React 18 + Vite
- React Router 6 (History API)
- Axios
- json-server (имитация REST API)

## Структура

```
src/
├── App.jsx              # маршруты
├── api/incidents.js     # axios-обёртка над REST API
├── components/
│   └── ErrorBanner.jsx
├── pages/
│   ├── Home.jsx         # список (GET, DELETE)
│   ├── Detail.jsx       # детализация (GET)
│   ├── Form.jsx         # добавление (POST)
│   ├── Edit.jsx         # редактирование (PUT)
│   ├── IncidentForm.jsx # общая форма + валидация
│   └── NotFound.jsx     # 404
└── styles.css

db.json                  # моковая база (6 инцидентов)
```

Сущность `Incident`: `id`, `title`, `institution`, `type`, `date`, `severity`, `status`, `responsible`, `description`.

## Маршруты

- `/` — список инцидентов
- `/detail/:id` — карточка инцидента
- `/add` — форма добавления
- `/edit/:id` — форма редактирования
- `*` — 404

## Локальный запуск

```bash
npm install
npm run server   # json-server, порт 5050
npm run dev      # vite,        порт 5173
```

Открыть http://localhost:5173.

## Продакшен-билд

`baseURL` для axios берётся из переменной окружения `VITE_API_URL` (по умолчанию `http://localhost:5050`). Для проксирования через nginx сборка собирается так:

```bash
VITE_API_URL=/api npm run build
```

На сервере nginx раздаёт `dist/` и проксирует `/api/` на `localhost:5050`, где работает json-server как systemd-сервис.
