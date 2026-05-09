# Передача проекта через Git

Этот файл описывает, как безопасно передать проект другому разработчику через GitHub/GitLab/Bitbucket без утечки заявок, отзывов с контактами и секретов.

## 1. Что нужно передавать

В репозиторий нужно коммитить:

- исходный код `app/`, `server/`, `public/`, `docs/`;
- `package.json` и `package-lock.json`;
- `nuxt.config.ts`, `README.md`, `.gitignore`;
- `.env.example`;
- `.data/apartments.json`, если нужно передать текущий каталог ЖК вместе с проектом.

`app/data/apartments.ts` остаётся fallback-набором для чистого окружения, но после работы админки главным источником объектов становится `.data/apartments.json`.

## 2. Что нельзя коммитить

Нельзя отправлять в git:

- `.env` и любые `.env.*` с реальными паролями/ключами;
- `.data/contact-requests.json` - заявки из форм;
- `.data/subscriptions.json` - email-подписки;
- `.data/reviews.json`, если там есть pending-отзывы с контактами;
- `.data/content/` и `.data/**/*.sqlite` - локальный cache/content storage;
- `.nuxt/`, `.output/`, `node_modules/`, `dist/`;
- `test-results/`;
- локальные скрипты автокоммита, например `auto-git.sh`.

Эти правила уже добавлены в `.gitignore`.

## 3. Проверка перед коммитом

Проверить текущий статус:

```bash
git status --short --branch
```

Проверить, что секреты не попадут в индекс:

```bash
git status --short .env .data/contact-requests.json .data/subscriptions.json .data/reviews.json
```

Если файл случайно уже добавлен в индекс, убрать его из индекса без удаления локально:

```bash
git rm --cached .env
git rm --cached .data/contact-requests.json
git rm --cached .data/subscriptions.json
git rm --cached .data/reviews.json
```

Если нужно передать отзывы, сначала удалить из `.data/reviews.json` pending-записи и контакты, либо передать файл отдельно защищённым способом.

## 4. Текущий важный нюанс репозитория

Сейчас репозиторий находится в состоянии `HEAD (no branch)`, а файл `auto-git.sh` имеет конфликт `AA`.

Перед нормальным коммитом нужно сделать одно из двух:

1. Если `auto-git.sh` не нужен в репозитории:

```bash
git rm --cached -f auto-git.sh
```

Файл останется локально и будет игнорироваться `.gitignore`.

2. Если скрипт нужен:

Открыть `auto-git.sh`, удалить конфликтные маркеры `<<<<<<<`, `=======`, `>>>>>>>`, оставить одну версию скрипта и выполнить:

```bash
git add auto-git.sh
```

Также лучше перейти на рабочую ветку:

```bash
git switch -c handoff
```

или на существующую ветку проекта:

```bash
git switch main
```

## 5. Коммит и отправка

После проверки:

```bash
git add README.md docs .gitignore .env.example app server public nuxt.config.ts package.json package-lock.json .data/apartments.json
git status --short
git commit -m "Prepare project handoff"
git push origin HEAD
```

Если нужно отправить в конкретную ветку:

```bash
git push origin HEAD:main
```

или:

```bash
git push origin HEAD:handoff
```

## 6. Как другому разработчику запустить проект

Клонировать:

```bash
git clone <repo-url>
cd newBuildNovosib
```

Установить зависимости:

```bash
npm install
```

Создать `.env` из примера:

```bash
cp .env.example .env
```

Заполнить:

```env
ADMIN_LOGIN=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
NUXT_PUBLIC_SITE_URL=
NUXT_PUBLIC_YANDEX_MAPS_API_KEY=
```

Запустить dev-сервер:

```bash
npm run dev
```

Проверить production-сборку:

```bash
npm run build
```

## 7. Как работают объекты ЖК после передачи

При запуске сервер читает `.data/apartments.json`.

Если файла нет, сервер создаёт его из `app/data/apartments.ts`. Поэтому:

- для передачи текущего каталога нужно коммитить `.data/apartments.json`;
- для чистого шаблона можно не передавать `.data/apartments.json`, тогда будут использованы fallback-данные;
- после любых правок через админку актуальным источником становится `.data/apartments.json`;
- при изменении структуры объекта нужно обновлять `app/data/apartments.ts`, `server/utils/adminStore.ts`, `app/pages/admin/index.vue`, `app/components/ApartmentCards.vue` и `app/pages/catalog/[slug].vue`.

Изображения, загруженные через админку, сохраняются в `public/content/uploads/`. Если они используются объектами из `.data/apartments.json`, эту папку тоже нужно передать и сохранять на production.
