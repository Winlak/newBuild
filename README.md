# Новостройки НСК

Сайт сервиса подбора квартир в новостройках Новосибирска.

Проект включает:

- главную страницу с поиском;
- каталог жилых комплексов;
- карточки ЖК с ценами, ипотекой, фото, описанием, похожими объектами и картой;
- единую форму заявки;
- страницу отзывов с модерацией;
- админку для управления ЖК, заявками, подписками и отзывами;
- SEO-настройки, sitemap, robots.txt и JSON-LD;
- интеграцию с Яндекс Картами.

Полная документация находится здесь:

[docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md)

Инструкция передачи другому разработчику через git:

[docs/GIT_HANDOFF.md](docs/GIT_HANDOFF.md)

## Быстрый запуск

Установить зависимости:

```bash
npm install
```

Запустить dev-сервер:

```bash
npm run dev
```

Открыть:

```text
http://localhost:3000
```

## Production

Собрать проект:

```bash
npm run build
```

Запустить production-сервер:

```bash
node .output/server/index.mjs
```

С конкретным портом:

```bash
PORT=3013 HOST=127.0.0.1 node .output/server/index.mjs
```

## Переменные окружения

Минимальный набор:

```env
ADMIN_LOGIN=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
NUXT_PUBLIC_SITE_URL=
NUXT_PUBLIC_YANDEX_MAPS_API_KEY=
```

Подробное описание переменных, структуры данных, API, админки, SEO и деплоя см. в полной документации:

[docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md)

## Важные директории

```text
app/      Vue/Nuxt страницы, компоненты, утилиты
server/   Nitro API, routes, серверные утилиты
public/   публичные изображения и ассеты
.data/    рабочее JSON-хранилище проекта
docs/     документация проекта
```

Важно: `.data/` и `public/content/uploads/` нужно сохранять между production-релизами, иначе можно потерять объекты, заявки, отзывы и загруженные изображения.

Для git обычно коммитится только `.data/apartments.json`, если нужно передать текущий каталог ЖК. Заявки, подписки, pending-отзывы с контактами, `.env` и локальные cache-файлы коммитить нельзя.
