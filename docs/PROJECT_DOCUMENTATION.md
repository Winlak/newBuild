# Документация проекта "Новостройки НСК"

## 1. Назначение проекта

Проект представляет собой сайт сервиса подбора квартир в новостройках Новосибирска. Основные задачи сайта:

- показать каталог жилых комплексов;
- дать пользователю быстрый поиск по району, метро, цене, отделке и другим параметрам;
- открыть карточку конкретного ЖК с фото, ценами, ипотекой, описанием, похожими ЖК и картой;
- собрать заявку на подбор квартиры через единую форму;
- собрать отзывы клиентов и отправлять их на модерацию;
- дать владельцу сайта админку для управления объектами, отзывами, заявками и подписками;
- обеспечить базовую SEO-индексацию страниц каталога и объектов.

Проект построен на Nuxt 4, Vue 3 и Nitro server routes. Данные хранятся в JSON-файлах внутри `.data`, без отдельной внешней базы данных.

## 2. Технологический стек

Основные технологии:

- `Nuxt 4.4.2` - SSR/приложение, роутинг, сборка, Nitro API.
- `Vue 3.5` - компоненты интерфейса.
- `Nitro` - серверные API-роуты.
- `Bootstrap CSS` и `Bootstrap Icons` - базовая сетка, утилиты и иконки.
- `FontAwesome` - часть иконок в контактных блоках.
- `Yandex Maps API 2.1` - интерактивные карты.
- JSON-файлы в `.data` - постоянное хранение объектов, отзывов, заявок и подписок.

Пакетные команды определены в [package.json](../package.json):

```bash
npm run dev
npm run build
npm run preview
npm run generate
```

## 3. Быстрый старт

### 3.1. Установка зависимостей

```bash
npm install
```

### 3.2. Локальный запуск

```bash
npm run dev
```

По умолчанию Nuxt запускается на:

```text
http://localhost:3000
```

В `nuxt.config.ts` dev-сервер настроен так:

```ts
devServer: {
  host: '0.0.0.0',
  port: 3000,
}
```

Это позволяет открывать сайт не только с `localhost`, но и через devtunnel/локальную сеть при корректной настройке хоста.

### 3.3. Production-сборка

```bash
npm run build
```

После сборки Nuxt создаёт `.output`. Локально production-сервер можно запустить так:

```bash
node .output/server/index.mjs
```

Либо через:

```bash
npm run preview
```

Если нужен конкретный порт:

```bash
PORT=3013 HOST=127.0.0.1 node .output/server/index.mjs
```

## 4. Переменные окружения

Проект использует runtime config из [nuxt.config.ts](../nuxt.config.ts).

Нужные переменные:

```env
ADMIN_LOGIN=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
NUXT_PUBLIC_SITE_URL=
NUXT_PUBLIC_YANDEX_MAPS_API_KEY=
```

### 4.1. `ADMIN_LOGIN`

Логин для входа в админку `/admin`.

### 4.2. `ADMIN_PASSWORD`

Пароль для входа в админку.

Если `ADMIN_LOGIN` или `ADMIN_PASSWORD` не заданы, endpoint входа вернёт ошибку:

```text
ADMIN_LOGIN и ADMIN_PASSWORD не заданы в .env
```

### 4.3. `ADMIN_SESSION_SECRET`

Секрет для подписи cookie админ-сессии. Если не задан, используется `ADMIN_PASSWORD`, а если и он не задан, fallback `change-me`.

Для production обязательно задавать отдельный длинный секрет.

Пример:

```env
ADMIN_SESSION_SECRET=long-random-string
```

### 4.4. `NUXT_PUBLIC_SITE_URL`

Публичный домен сайта. Используется для:

- canonical URL;
- Open Graph URL;
- sitemap;
- robots.txt;
- JSON-LD structured data.

Если не задан, используется:

```text
https://novostroyki-nsk.ru
```

Для production нужно указать реальный домен:

```env
NUXT_PUBLIC_SITE_URL=https://example.ru
```

### 4.5. `NUXT_PUBLIC_YANDEX_MAPS_API_KEY`

Публичный API-ключ Яндекс Карт.

Используется в [app/utils/yandexMaps.ts](../app/utils/yandexMaps.ts), где загружается скрипт:

```text
https://api-maps.yandex.ru/2.1/?apikey=...&lang=ru_RU
```

Ключ публичный, потому что нужен браузеру. Его всё равно следует ограничивать в кабинете Яндекса по доменам.

## 5. Структура проекта

Ключевые директории:

```text
app/
  app.vue
  layouts/
  pages/
  components/
  data/
  utils/
  plugins/

server/
  api/
  routes/
  utils/

public/
  content/
  icons/
  favicon.ico

.data/
  apartments.json
  reviews.json
  contact-requests.json
  subscriptions.json
```

### 5.1. `app/pages`

Страницы сайта:

- [app/pages/index.vue](../app/pages/index.vue) - главная страница.
- [app/pages/catalog/index.vue](../app/pages/catalog/index.vue) - каталог ЖК.
- [app/pages/catalog/[slug].vue](../app/pages/catalog/[slug].vue) - карточка объекта.
- [app/pages/about/index.vue](../app/pages/about/index.vue) - о компании.
- [app/pages/contacts/index.vue](../app/pages/contacts/index.vue) - контакты.
- [app/pages/reviews/index.vue](../app/pages/reviews/index.vue) - отзывы.
- [app/pages/privacy.vue](../app/pages/privacy.vue) - политика конфиденциальности.
- [app/pages/admin/index.vue](../app/pages/admin/index.vue) - админка.

### 5.2. `app/components`

Основные компоненты:

- `AppNavbar.vue` - верхняя навигация.
- `AppFooterType4.vue` - текущий футер с контактами, соцсетями и подпиской.
- `AppRequestModal.vue` - единое модальное окно заявки.
- `MainScreen.vue` - первый экран главной страницы и поиск.
- `ApartmentCards.vue` - каталог, фильтры, карточки ЖК.
- `CatalogComplexMap.vue` - карта комплекса/каталога.
- `YandexMap.vue` - обёртка над Яндекс Картами.
- `MapSpotlight.vue` - блок карты на главной.
- `ContactHero.vue`, `ContactBlock.vue`, `ContactInfoCard.vue`, `ContactMapBlock.vue` - контактная страница.
- `AboutHero.vue`, `AboutIntroStats.vue`, `BenefitsGrid.vue`, `WorkSteps.vue` - страница "О компании".
- `ReviewsCtaSection.vue` - CTA-блок с отзывами.

### 5.3. `server/api`

Серверные API-роуты Nitro:

Публичные:

- `GET /api/apartments`
- `GET /api/apartments/:slug`
- `POST /api/contact`
- `POST /api/subscribe`
- `GET /api/reviews`
- `POST /api/reviews`

Админские:

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/me`
- `GET /api/admin/apartments`
- `POST /api/admin/apartments`
- `PUT /api/admin/apartments/:slug`
- `DELETE /api/admin/apartments/:slug`
- `GET /api/admin/reviews`
- `PATCH /api/admin/reviews/:id`
- `DELETE /api/admin/reviews/:id`
- `GET /api/admin/contact-requests`
- `DELETE /api/admin/contact-requests/:id`
- `GET /api/admin/subscriptions`
- `DELETE /api/admin/subscriptions/:id`
- `POST /api/admin/uploads`

### 5.4. `server/routes`

Служебные публичные routes:

- `GET /robots.txt`
- `GET /sitemap.xml`

Они реализованы вручную, а не только через модуль.

### 5.5. `app/data`

Fallback-данные:

- [app/data/apartments.ts](../app/data/apartments.ts) - стартовый список ЖК и типы данных.
- [app/data/reviews.ts](../app/data/reviews.ts) - стартовые отзывы.

Если `.data/apartments.json` или `.data/reviews.json` отсутствуют, серверные утилиты создают эти файлы из fallback-данных.

### 5.6. `.data`

Рабочее хранилище проекта.

Файлы:

- `.data/apartments.json` - актуальные ЖК.
- `.data/reviews.json` - отзывы, включая pending/approved.
- `.data/contact-requests.json` - заявки из форм.
- `.data/subscriptions.json` - email-подписки из футера.

Важно: `.data` является фактической базой данных проекта. При деплое нужно обеспечить сохранность этой директории между релизами.

Для передачи проекта через git действует отдельное правило:

- `.data/apartments.json` можно коммитить, если другому разработчику нужен текущий каталог объектов;
- `.data/contact-requests.json` нельзя коммитить, потому что там заявки пользователей;
- `.data/subscriptions.json` нельзя коммитить, потому что там email-подписки;
- `.data/reviews.json` нельзя коммитить без предварительной чистки, потому что pending-отзывы могут содержать контакты;
- `.data/content/` и `.data/**/*.sqlite` не являются рабочими данными каталога и не нужны в git.

## 6. Архитектура данных

### 6.1. Apartment

Тип описан в [app/data/apartments.ts](../app/data/apartments.ts).

Поля:

```ts
interface Apartment {
  slug: string
  title: string
  complex: string
  address: string
  district: string
  image: string
  images?: string[]
  price: number
  pricePerMeter: number
  mortgagePayment: number
  rooms: string
  area: number
  kitchenArea: number
  floor: number
  totalFloors: number
  finish: string
  completion: string
  builder: string
  metroStation: string
  metroWalkMinutes: number
  metroDistanceMeters: number
  verified: boolean
  verificationReport?: string
  phone: string
  phoneHref: string
  coordinates: {
    lat: number
    lng: number
  }
  searchParams?: ApartmentSearchParam[]
  tags: string[]
  features: string[]
  unitMix: ApartmentUnit[]
  description: string
}
```

Пояснения к ключевым полям:

- `slug` - URL-идентификатор объекта, используется в `/catalog/:slug`.
- `title` - заголовок объекта.
- `complex` - название ЖК.
- `image` - основное изображение.
- `images` - галерея объекта.
- `price` - базовая цена объекта, используется как fallback.
- `mortgagePayment` - базовый платёж по ипотеке, используется как fallback.
- `rooms`, `area`, `finish` - fallback-поля для объекта, если `unitMix` пустой.
- `unitMix` - основной источник диапазонов квартир, цен, площадей и количества вариантов.
- `verified` - статус проверки.
- `verificationReport` - текст проверки.
- `searchParams` - параметры, которые отображаются на карточках и используются фильтрами.
- `coordinates` - координаты для Яндекс Карт.

### 6.2. ApartmentUnit

```ts
interface ApartmentUnit {
  rooms: string
  label: string
  areaFrom: number
  areaTo: number
  priceFrom: number
  priceTo: number
  mortgageFrom: number
  count: number
  finish: string
}
```

Каждый `unitMix` описывает один тип квартир в ЖК:

- студии;
- 1-комнатные;
- 2-комнатные;
- 3-комнатные;
- иной тип, если он нужен.

Именно из `unitMix` считаются:

- минимальная цена;
- максимальная цена;
- минимальный платёж по ипотеке;
- диапазон площадей;
- общее количество квартир в подборке.

### 6.3. ApartmentSearchParam

Доступные значения:

```ts
type ApartmentSearchParam =
  | 'renovation'
  | 'furniture'
  | 'installment'
  | 'mortgage_no_dp'
  | 'completed'
  | 'studio'
```

Расшифровка:

- `renovation` - с ремонтом;
- `furniture` - с мебелью;
- `installment` - с рассрочкой;
- `mortgage_no_dp` - ипотека без первоначального взноса;
- `completed` - дом сдан;
- `studio` - есть студии.

Эти параметры:

- проставляются в админке галочками;
- отображаются на карточках ЖК;
- отображаются в карточке объекта;
- участвуют в фильтрации каталога.

### 6.4. ReviewRecord

Отзывы хранятся в `.data/reviews.json`.

Структура:

```ts
interface ReviewRecord {
  id: string
  name: string
  subtitle: string
  text: string
  rating: number
  avatar?: string
  contact?: string
  status: 'approved' | 'pending'
  createdAt: string
}
```

Отзывы с сайта создаются со статусом `pending`. В админке их можно одобрить или удалить.

### 6.5. ContactRequestRecord

Заявки из форм сохраняются в `.data/contact-requests.json`.

Структура:

```ts
interface ContactRequestRecord {
  id: string
  name: string
  phone: string
  email?: string
  message?: string
  time?: string
  source?: string
  createdAt: string
}
```

Поле `source` показывает, откуда пришла заявка:

- `navbar`;
- `contacts-page`;
- `request-modal`;
- `reviews-cta`;
- `consultation-banner`;
- `home-footer`;
- другое значение, если форма передала свой source.

### 6.6. SubscriptionRecord

Подписки из футера сохраняются в `.data/subscriptions.json`.

```ts
interface SubscriptionRecord {
  id: string
  email: string
  source?: string
  createdAt: string
}
```

## 7. Хранение данных

### 7.1. Как читаются ЖК и отзывы

Файл [server/utils/adminStore.ts](../server/utils/adminStore.ts) отвечает за:

- чтение `.data/apartments.json`;
- запись `.data/apartments.json`;
- чтение `.data/reviews.json`;
- запись `.data/reviews.json`;
- нормализацию объекта ЖК;
- генерацию slug.

Если JSON-файл отсутствует или не читается, утилита создаёт его из fallback-данных в `app/data`.

### 7.2. Источник правды для объектов ЖК

Для объектов ЖК есть два уровня данных:

1. `app/data/apartments.ts` - типы TypeScript и стартовый fallback-набор объектов.
2. `.data/apartments.json` - рабочая база объектов после первого запуска или после изменений через админку.

Порядок работы такой:

- при чтении объектов `readApartments()` пытается прочитать `.data/apartments.json`;
- если файла нет, создаётся `.data/apartments.json` на основе `app/data/apartments.ts`;
- публичный каталог, главная страница, sitemap и карточка ЖК читают объекты через API;
- админка сохраняет изменения обратно в `.data/apartments.json`;
- `app/data/apartments.ts` после этого уже не перезаписывает существующую рабочую базу.

Практическое правило: если объект уже редактировался в админке, править его нужно в админке или в `.data/apartments.json`. Правки только в `app/data/apartments.ts` не попадут в существующий production-каталог.

### 7.3. Жизненный цикл объекта ЖК

Объект создаётся или редактируется в `/admin` во вкладке ЖК.

При сохранении:

- админка собирает payload типа `Apartment`;
- `POST /api/admin/apartments` создаёт новый объект;
- `PUT /api/admin/apartments/:slug` обновляет существующий объект;
- `server/utils/adminStore.ts` нормализует поля через `normalizeApartment()`;
- результат записывается в `.data/apartments.json`.

`slug` используется в URL `/catalog/:slug`. Если менять `slug` вручную, старая ссылка перестанет открываться. Для SEO и внешних ссылок slug лучше считать стабильным идентификатором объекта.

### 7.4. Основные поля объекта

Ключевые поля, которые реально участвуют в интерфейсе:

- `complex` - публичное название ЖК;
- `title` - дополнительный заголовок/тип объекта, используется как служебный заголовок;
- `address`, `district`, `metroStation`, `metroDistanceMeters` - адресные данные и фильтры;
- `coordinates.lat`, `coordinates.lng` - точка на Яндекс Карте;
- `image` - главное фото;
- `images` - галерея объекта и фото в похожих ЖК;
- `price`, `mortgagePayment` - fallback-значения, если по типам квартир нет данных;
- `unitMix` - главный источник цены от, ипотеки от, площадей и количества квартир;
- `verified`, `verificationReport` - статус и текст проверки объявления;
- `searchParams` - галочки из админки: ремонт, мебель, рассрочка, ипотека без ПВ, дом сдан, студии;
- `description` - текст объявления для карточки каталога и страницы объекта;
- `phone`, `phoneHref` - номер для кнопки звонка.

`builder` может оставаться в данных для внутренней совместимости, но публично застройщик не выводится, чтобы пользователь звонил в сервис.

### 7.5. `unitMix` и количество квартир

`unitMix` - это массив типов квартир в ЖК. Например: студии, 1-комнатные, 2-комнатные.

Из `unitMix` считаются:

- минимальная цена объекта;
- максимальная цена объекта;
- минимальный платёж по ипотеке;
- диапазон площадей;
- общее количество квартир;
- карточки "Квартиры в комплексе".

Если `unitMix` пустой, часть интерфейса использует fallback-поля `price`, `mortgagePayment`, `rooms`, `area`, `finish`. Для нормальной карточки объекта `unitMix` лучше заполнять всегда.

### 7.6. Фото объектов

Фото могут быть:

- статическими файлами в `public/content/`;
- файлами, загруженными через админку в `public/content/uploads/`;
- внешними URL, если их явно записали в данные.

`image` должен указывать на главное фото. `images` содержит галерею. Если `images` пустой, интерфейс использует `image`.

Важно: если `.data/apartments.json` ссылается на файлы из `public/content/uploads/`, эту папку нужно передавать вместе с проектом и сохранять между production-релизами.

### 7.7. Как сохраняются заявки и подписки

Файл [server/utils/submissionStore.ts](../server/utils/submissionStore.ts) отвечает за:

- чтение массива записей из JSON-файла;
- перезапись массива;
- добавление новой записи в начало массива.

Новые заявки добавляются в начало файла, поэтому свежие записи видны первыми.

### 7.8. Ограничения JSON-хранилища

JSON-хранилище простое и подходит для небольшого проекта, но имеет ограничения:

- нет транзакций;
- при одновременной записи теоретически возможна потеря одной из записей;
- нет индексов и поиска на уровне базы;
- нужно отдельно заботиться о backup;
- на сервере с ephemeral filesystem данные могут пропасть после redeploy.

Если заявок станет много или появится несколько администраторов, стоит перейти на Postgres/Supabase/SQLite с транзакциями.

## 8. Публичные страницы

### 8.1. Главная `/`

Файл: [app/pages/index.vue](../app/pages/index.vue)

Состав:

- `MainScreen` - главный экран, поиск, быстрые фильтры.
- `MapSpotlight` - блок с картой.
- `WhyChooseUs` - преимущества.
- `AppFooter` - дополнительный footer/форма.

SEO:

- title оптимизирован под "Новостройки Новосибирска от застройщика";
- description включает цены, застройщика, ипотеку, ремонт, районы и "под ключ";
- JSON-LD `RealEstateAgent`.

### 8.2. Каталог `/catalog`

Файл: [app/pages/catalog/index.vue](../app/pages/catalog/index.vue)

Основной компонент: [app/components/ApartmentCards.vue](../app/components/ApartmentCards.vue)

Функции:

- список ЖК;
- поиск по району/метро;
- фильтры по комнатности, цене, условиям, району, отделке, сроку сдачи;
- сортировка;
- избранное;
- сохранение поиска;
- карта;
- переход в карточку объекта.

SEO:

- title: "Новостройки Новосибирска с ценами";
- description динамически подставляет количество ЖК и минимальную цену;
- JSON-LD `CollectionPage` и `ItemList`;
- BreadcrumbList.

### 8.3. Карточка ЖК `/catalog/:slug`

Файл: [app/pages/catalog/[slug].vue](../app/pages/catalog/[slug].vue)

Данные загружаются из:

```ts
const route = useRoute()
const slug = String(route.params.slug)

const { data: allApartments } = await useFetch<Apartment[]>('/api/apartments', {
  key: 'public-apartments',
  default: () => fallbackApartments,
})

const apartment = computed(() => (allApartments.value?.length ? allApartments.value : fallbackApartments)
  .find(item => item.slug === slug))
```

Отдельный endpoint `GET /api/apartments/:slug` на сервере есть, но текущая страница объекта использует общий список, чтобы не делать второй лишний запрос после каталога и упростить подбор похожих ЖК.

Функции:

- фото и галерея;
- название ЖК;
- количество вариантов квартир;
- параметры из поиска;
- проверка объявления;
- адрес и метро;
- цена от;
- ипотека от;
- кнопка звонка;
- описание;
- таблица/карточки типов квартир;
- карта расположения;
- похожие ЖК ниже карты.

Особенности:

- название застройщика не выводится пользователю;
- `builder` может храниться в данных, но не используется как публичный акцент;
- Яндекс-карта lazy-load, чтобы не грузить внешние скрипты до появления карты рядом с viewport;
- похожие ЖК сортируются по району, метро и близости цены.

SEO:

- title включает название ЖК и минимальную цену;
- description включает район, площадь, количество вариантов, метро и расстояние;
- JSON-LD `Residence`;
- JSON-LD `AggregateOffer`;
- JSON-LD `GeoCoordinates`;
- JSON-LD `BreadcrumbList`.

### 8.4. О компании `/about`

Файл: [app/pages/about/index.vue](../app/pages/about/index.vue)

Состав:

- `AboutHero`;
- `AboutIntroStats`;
- `BenefitsGrid`;
- `WorkSteps`;
- `ReviewsCtaSection`.

SEO:

- `AboutPage`;
- BreadcrumbList.

### 8.5. Контакты `/contacts`

Файл: [app/pages/contacts/index.vue](../app/pages/contacts/index.vue)

Состав:

- `ContactHero`;
- `ContactBlock`;
- `BenefitsCards`;
- `ContactMapBlock`;
- `ConsultationBanner`.

Кнопки заявки вызывают:

```ts
openRequestModal({ source: 'contacts-page' })
```

SEO:

- `ContactPage`;
- mainEntity `RealEstateAgent`;
- BreadcrumbList.

### 8.6. Отзывы `/reviews`

Файл: [app/pages/reviews/index.vue](../app/pages/reviews/index.vue)

Функции:

- показывает только approved-отзывы;
- открывает попап отправки отзыва;
- новый отзыв сохраняется как pending;
- администратор может одобрить отзыв в админке.

SEO:

- `ReviewPage`;
- `AggregateRating`;
- список `Review`;
- BreadcrumbList.

### 8.7. Политика конфиденциальности `/privacy`

Файл: [app/pages/privacy.vue](../app/pages/privacy.vue)

Содержит краткую политику обработки персональных данных и email для обращений.

## 9. Админка

Админка находится на:

```text
/admin
```

Файл:

```text
app/pages/admin/index.vue
```

### 9.1. Авторизация

Авторизация работает через:

- `POST /api/admin/login`;
- cookie `admin_session`;
- HMAC-подпись;
- срок жизни 12 часов.

Cookie создаётся в [server/utils/adminAuth.ts](../server/utils/adminAuth.ts).

Для входа нужны:

```env
ADMIN_LOGIN=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

### 9.2. Вкладка "ЖК"

Позволяет:

- создать ЖК;
- редактировать ЖК;
- удалить ЖК;
- проставить статус "Проверен";
- загрузить фото;
- выбрать главное фото;
- удалить фото из галереи;
- добавить типы квартир;
- заполнить параметры поиска;
- заполнить описание;
- заполнить координаты.

При сохранении данные уходят:

- `POST /api/admin/apartments` для нового объекта;
- `PUT /api/admin/apartments/:slug` для редактирования.

### 9.3. Вкладка "Заявки"

Показывает:

- заявки из `.data/contact-requests.json`;
- подписки из `.data/subscriptions.json`.

Для заявок доступны:

- имя;
- телефон;
- комментарий;
- email, если был передан;
- желаемое время, если было передано;
- source;
- дата создания;
- кнопка "Позвонить";
- удаление.

Для подписок доступны:

- email;
- source;
- дата создания;
- кнопка "Написать";
- удаление.

### 9.4. Вкладка "Отзывы"

Показывает:

- pending-отзывы;
- approved-отзывы.

Можно:

- одобрить pending-отзыв;
- удалить отзыв.

### 9.5. Загрузка изображений

Endpoint:

```text
POST /api/admin/uploads
```

Файл: [server/api/admin/uploads.post.ts](../server/api/admin/uploads.post.ts)

Допустимые MIME-типы:

- `image/jpeg`;
- `image/png`;
- `image/webp`;
- `image/gif`;
- `image/avif`.

Файлы сохраняются в:

```text
public/content/uploads/
```

В ответ возвращается массив путей:

```json
{
  "images": ["/content/uploads/file.jpg"]
}
```

## 10. Формы и заявки

### 10.1. Единая модальная форма заявки

Компонент:

```text
app/components/AppRequestModal.vue
```

Открывается через helper:

```ts
openRequestModal({ source: 'navbar' })
```

Helper находится в:

```text
app/utils/requestModal.ts
```

Механизм:

1. Любой компонент вызывает `openRequestModal`.
2. Helper отправляет browser event `open-request-modal`.
3. `AppRequestModal` слушает событие.
4. Модалка открывается.
5. При отправке форма вызывает `POST /api/contact`.

### 10.2. Endpoint заявки

```text
POST /api/contact
```

Файл:

```text
server/api/contact.post.ts
```

Payload:

```json
{
  "name": "Иван",
  "phone": "+7 999 999-99-99",
  "email": "optional@example.ru",
  "message": "Хочу квартиру у метро",
  "time": "После 18:00",
  "source": "navbar"
}
```

Валидация:

- имя минимум 2 символа;
- телефон должен содержать минимум 7 цифр.

Сохранение:

```text
.data/contact-requests.json
```

### 10.3. Подписка из футера

Компонент:

```text
app/components/AppFooterType4.vue
```

Endpoint:

```text
POST /api/subscribe
```

Payload:

```json
{
  "email": "user@example.ru",
  "source": "footer"
}
```

Сохранение:

```text
.data/subscriptions.json
```

### 10.4. Отзывы

Endpoint:

```text
POST /api/reviews
```

Payload:

```json
{
  "name": "Анна",
  "subtitle": "Купила 2-комнатную квартиру",
  "text": "Текст отзыва",
  "rating": 5,
  "contact": "+7 999 999-99-99"
}
```

Новый отзыв получает:

```json
{
  "status": "pending"
}
```

Публично показываются только approved-отзывы.

## 11. Каталог и поиск

Основная логика каталога находится в:

```text
app/components/ApartmentCards.vue
```

### 11.1. Источник данных

Каталог загружает:

```text
GET /api/apartments
```

Если запрос не сработает, компонент может использовать fallback-данные из `app/data/apartments.ts`.

### 11.2. Поиск

Поиск работает по:

- району;
- метро;
- названию ЖК.

На главной поисковая форма формирует query-параметры и отправляет пользователя в каталог:

```text
/catalog?q=Октябрьский&scope=district
/catalog?q=Речной вокзал&scope=metro
```

Каталог читает query-параметры при открытии.

### 11.3. Быстрые фильтры

Быстрые параметры основаны на `searchParams`:

- с ремонтом;
- с мебелью;
- с рассрочкой;
- ипотека без ПВ;
- дом сдан;
- студии.

### 11.4. Остальные фильтры

В каталоге также есть фильтры:

- покупка/тип объекта;
- цена;
- проверенные;
- до метро;
- район;
- отделка;
- срок сдачи;
- сортировка.

### 11.5. Сохранение поиска

Сохранение поиска работает через `localStorage`. Ключ:

```text
newbuild-catalog-saved-search-filters
```

Это клиентское сохранение, оно не отправляется на сервер.

## 12. Карты

### 12.1. YandexMap

Компонент:

```text
app/components/YandexMap.vue
```

Утилита загрузки:

```text
app/utils/yandexMaps.ts
```

Компонент принимает массив точек:

```ts
export interface YandexMapPoint {
  id: string
  title: string
  subtitle?: string
  coordinates: {
    lat: number
    lng: number
  }
  priceLabel?: string
  balloonHtml?: string
}
```

### 12.2. Lazy loading

`YandexMap` поддерживает lazy loading через `IntersectionObserver`.

По умолчанию:

- карта не грузит Яндекс API сразу;
- карта начинает инициализацию только когда блок карты появляется рядом с viewport;
- это уменьшает лишние внешние запросы на страницах, где карта ниже первого экрана.

### 12.3. API-ключ

API-ключ берётся из:

```env
NUXT_PUBLIC_YANDEX_MAPS_API_KEY
```

Если ключ пустой, карта не сможет загрузиться.

### 12.4. Получение ключа Яндекс Карт

Общий порядок:

1. Войти в кабинет разработчика Яндекса.
2. Создать ключ для JavaScript API / Maps API.
3. Разрешить нужные домены.
4. Добавить ключ в `.env`.
5. Перезапустить dev/prod-сервер.

В production ключ нужно ограничить по домену, чтобы его нельзя было использовать на чужих сайтах.

## 13. SEO

SEO-логика находится в:

```text
app/utils/seo.ts
server/routes/robots.txt.get.ts
server/routes/sitemap.xml.get.ts
server/utils/seo.ts
```

### 13.1. usePageSeo

Основной helper:

```ts
usePageSeo({
  title: '...',
  description: '...',
  path: '/catalog',
  image: '/content/MainIMG.webp',
  keywords: ['...'],
})
```

Он выставляет:

- title;
- meta description;
- meta keywords;
- Open Graph title/description/image/url;
- Twitter Card;
- robots;
- canonical.

Canonical очищается от query/hash, чтобы не плодить дубли.

### 13.2. Общий SEO-словарь

В `defaultSeoKeywords` добавлены коммерческие ключи:

- новостройки новосибирск;
- квартиры в новостройке новосибирск;
- купить новостройку в новосибирске;
- новостройки новосибирска от застройщика;
- купить квартиру в новосибирске в новостройке;
- новосибирск новостройка цена;
- и другие фразы по новостройкам, ипотеке, ремонту и районам.

Эти фразы автоматически добавляются к индексируемым страницам.

### 13.3. JSON-LD

Используется helper:

```ts
useJsonLd(...)
```

Глобально в `app/app.vue` добавлены:

- `WebSite`;
- `Organization`.

На страницах используются:

- `RealEstateAgent`;
- `CollectionPage`;
- `ItemList`;
- `Residence`;
- `AggregateOffer`;
- `GeoCoordinates`;
- `ContactPage`;
- `AboutPage`;
- `ReviewPage`;
- `AggregateRating`;
- `BreadcrumbList`.

### 13.4. Sitemap

Route:

```text
/sitemap.xml
```

Файл:

```text
server/routes/sitemap.xml.get.ts
```

Sitemap включает:

- `/`;
- `/catalog`;
- `/about`;
- `/contacts`;
- `/reviews`;
- все карточки объектов `/catalog/:slug`.

Для каждого URL выводятся:

- `loc`;
- `lastmod`;
- `changefreq`;
- `priority`.

`lastmod` берётся из даты изменения соответствующего файла/данных, а не просто из текущего времени.

### 13.5. Robots

Route:

```text
/robots.txt
```

Файл:

```text
server/routes/robots.txt.get.ts
```

Содержит:

```text
User-agent: *
Disallow: /admin
Disallow: /api/
Allow: /

Sitemap: https://.../sitemap.xml
```

### 13.6. X-Robots-Tag

В [nuxt.config.ts](../nuxt.config.ts) закрыты от индексации:

- `/admin`;
- `/admin/**`;
- `/api/admin/**`;
- `/api/**`.

## 14. Изображения и ассеты

### 14.1. Основные изображения

Хранятся в:

```text
public/content/
```

Есть PNG и WebP-версии. В интерфейсе используются WebP:

- `MainIMG.webp`;
- `ContactIMG.webp`;
- `AboutBG.webp`;
- `AboutFirstIMG.webp`;
- `AboutSecondIMG.webp`;
- `AskIMG.webp`;
- `MapIMG.webp`.

PNG оставлены как исходники/резерв.

### 14.2. Загружаемые изображения

Админка сохраняет загруженные файлы в:

```text
public/content/uploads/
```

Если сервер перезаписывает директорию `public` при деплое, нужно отдельно сохранять `public/content/uploads`.

### 14.3. Рекомендации по изображениям

Для новых изображений:

- использовать WebP или AVIF;
- держать размер файла разумным;
- избегать PNG для больших фотографий;
- использовать осмысленные фото ЖК, а не абстрактные картинки;
- проверять, что изображение не ломает карточки на мобильных.

## 15. Безопасность

### 15.1. Админка

Админка защищена cookie-сессией:

- cookie `admin_session`;
- httpOnly;
- sameSite `lax`;
- срок жизни 12 часов;
- HMAC-подпись.

Для production обязательно:

- задать `ADMIN_LOGIN`;
- задать сложный `ADMIN_PASSWORD`;
- задать отдельный `ADMIN_SESSION_SECRET`;
- использовать HTTPS.

### 15.2. API

Публичные API:

- доступны без авторизации;
- нужны для каталога, форм и отзывов.

Админские API:

- вызывают `requireAdmin(event)`;
- без валидной cookie возвращают 401.

### 15.3. Данные форм

Заявки и отзывы содержат персональные данные. Поэтому:

- `.data/contact-requests.json` нельзя отдавать публично;
- `.data/reviews.json` содержит контакты pending-отзывов;
- доступ к серверу и backup должен быть ограничен;
- на production нужна актуальная политика конфиденциальности.

### 15.4. API-ключ Яндекс Карт

Ключ публичный, но его нужно ограничить:

- по доменам;
- по API;
- по квотам.

## 16. Deployment

### 16.1. Общий процесс

1. Установить зависимости:

```bash
npm install
```

2. Задать переменные окружения.

3. Собрать:

```bash
npm run build
```

4. Запустить:

```bash
node .output/server/index.mjs
```

### 16.2. Что обязательно сохранить между релизами

Нужно сохранять:

```text
.data/
public/content/uploads/
```

Если эти директории не persist, после деплоя можно потерять:

- ЖК, созданные через админку;
- отзывы;
- заявки;
- подписки;
- загруженные изображения.

### 16.3. Передача проекта через git

Подробная инструкция вынесена в [docs/GIT_HANDOFF.md](GIT_HANDOFF.md).

Коротко:

- `.env` не коммитить;
- `.env.example` коммитить;
- `.data/apartments.json` можно коммитить, если нужно передать текущий каталог ЖК;
- `.data/contact-requests.json`, `.data/subscriptions.json`, `.data/reviews.json` не коммитить без чистки персональных данных;
- `.data/content/` и SQLite/cache-файлы не коммитить;
- `public/content/uploads/` нужно передать, если объекты используют загруженные через админку фото.

### 16.4. Nginx reverse proxy

Примерная схема:

```text
Internet -> Nginx -> Node/Nitro server
```

Рекомендуется:

- включить HTTPS;
- проксировать на `127.0.0.1:3000` или другой внутренний порт;
- настроить gzip/brotli;
- настроить cache headers для `/_nuxt/` и `/content/`;
- не кэшировать `/api/`.

### 16.5. PM2 пример

```bash
pm2 start .output/server/index.mjs --name newbuild-novosib
pm2 save
```

С переменными:

```bash
PORT=3000 HOST=127.0.0.1 pm2 start .output/server/index.mjs --name newbuild-novosib
```

## 17. Проверка проекта

### 17.1. Build

```bash
npm run build
```

Ожидаемый результат:

```text
Build complete
```

Известные предупреждения:

- `sharp binaries for darwin-arm64 cannot be found` - предупреждение Nuxt Image, сейчас проект в основном использует обычные public assets.
- `Some chunks are larger than 500 kB` - сигнал к будущей оптимизации бандла, но не ошибка.
- `/content/MainIMG.webp referenced ... didn't resolve at build time` - runtime public path остаётся рабочим.

### 17.2. Проверка страниц

После запуска production:

```bash
PORT=3013 HOST=127.0.0.1 node .output/server/index.mjs
```

Проверка:

```bash
curl -I http://127.0.0.1:3013/
curl -I http://127.0.0.1:3013/catalog
curl -I http://127.0.0.1:3013/catalog/datskiy-kvartal-1k-43
curl -I http://127.0.0.1:3013/robots.txt
curl -I http://127.0.0.1:3013/sitemap.xml
```

Ожидается `200`.

### 17.3. Проверка SEO HTML

Можно проверить title, description, canonical и JSON-LD:

```bash
curl -s http://127.0.0.1:3013/catalog/datskiy-kvartal-1k-43 > /tmp/page.html
```

Проверить вручную:

- `<title>`;
- `<meta name="description">`;
- `<meta name="keywords">`;
- `<link rel="canonical">`;
- `<script type="application/ld+json">`.

### 17.4. Проверка форм

Отправка заявки:

```bash
curl -X POST http://127.0.0.1:3013/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Тест","phone":"+79999999999","message":"Проверка","source":"manual-test"}'
```

После этого запись должна появиться в:

```text
.data/contact-requests.json
```

### 17.5. Проверка sitemap

```bash
curl http://127.0.0.1:3013/sitemap.xml
```

Проверить:

- домен правильный;
- есть `/catalog`;
- есть карточки объектов;
- есть `lastmod`.

### 17.6. Проверка robots

```bash
curl http://127.0.0.1:3013/robots.txt
```

Проверить:

- `/admin` закрыт;
- `/api/` закрыт;
- sitemap указан с правильным доменом.

## 18. Типовые операции

### 18.1. Добавить новый ЖК через админку

1. Открыть `/admin`.
2. Войти.
3. Вкладка `ЖК`.
4. Заполнить:
   - название ЖК;
   - адрес;
   - район;
   - метро;
   - расстояние до метро;
   - цену;
   - ипотеку;
   - этажность;
   - отделку;
   - срок сдачи;
   - телефон;
   - координаты;
   - описание.
5. Загрузить фото.
6. Добавить типы квартир в `unitMix`.
7. Проставить параметры поиска.
8. Сохранить.

### 18.2. Изменить фото ЖК

1. Открыть `/admin`.
2. Найти объект.
3. Нажать `Редактировать`.
4. Загрузить фото в блоке изображений.
5. Нажать `Главное` у нужного изображения.
6. Сохранить.

### 18.3. Проверить объявление

1. Открыть `/admin`.
2. Найти ЖК.
3. Нажать `Проверить` или открыть редактирование.
4. Заполнить `verificationReport`.
5. Сохранить.

На сайте появится зелёная надпись проверки.

### 18.4. Посмотреть заявки

1. Открыть `/admin`.
2. Перейти во вкладку `Заявки`.
3. Смотреть заявки и подписки.
4. Нажать `Позвонить` или `Написать`.
5. При необходимости удалить обработанную запись.

### 18.5. Одобрить отзыв

1. Открыть `/admin`.
2. Перейти во вкладку `Отзывы`.
3. Найти отзыв со статусом `На модерации`.
4. Нажать `Одобрить`.

После этого отзыв появится на странице `/reviews`.

## 19. API справочник

### 19.1. `GET /api/apartments`

Возвращает массив ЖК.

Response:

```json
[
  {
    "slug": "datskiy-kvartal-1k-43",
    "complex": "ЖК Датский квартал"
  }
]
```

### 19.2. `GET /api/apartments/:slug`

Возвращает один ЖК.

Если объект не найден:

```json
{
  "statusCode": 404,
  "statusMessage": "Квартира не найдена"
}
```

### 19.3. `POST /api/contact`

Создаёт заявку.

Request:

```json
{
  "name": "Иван",
  "phone": "+7 999 999-99-99",
  "message": "Нужна квартира до 7 млн",
  "source": "navbar"
}
```

Response:

```json
{
  "ok": true,
  "submission": {
    "id": "contact-1770000000000"
  }
}
```

### 19.4. `POST /api/subscribe`

Создаёт подписку.

Request:

```json
{
  "email": "user@example.ru",
  "source": "footer"
}
```

### 19.5. `GET /api/reviews`

Возвращает только approved-отзывы без приватных контактов.

### 19.6. `POST /api/reviews`

Создаёт отзыв со статусом `pending`.

### 19.7. `POST /api/admin/login`

Вход в админку.

Request:

```json
{
  "login": "admin",
  "password": "password"
}
```

Response:

```json
{
  "ok": true
}
```

Также выставляется cookie `admin_session`.

### 19.8. `POST /api/admin/logout`

Удаляет cookie админ-сессии.

### 19.9. `GET /api/admin/me`

Проверяет, авторизован ли пользователь.

### 19.10. `GET /api/admin/contact-requests`

Возвращает заявки. Требует авторизацию.

### 19.11. `DELETE /api/admin/contact-requests/:id`

Удаляет заявку. Требует авторизацию.

### 19.12. `GET /api/admin/subscriptions`

Возвращает подписки. Требует авторизацию.

### 19.13. `DELETE /api/admin/subscriptions/:id`

Удаляет подписку. Требует авторизацию.

## 20. Известные технические нюансы

### 20.1. Данные в `.data`

`.data` не должна случайно удаляться. Это рабочее хранилище проекта.

### 20.2. Public uploads

`public/content/uploads` также нужно сохранять между деплоями.

### 20.3. Большой JS/CSS bundle

В build появляются предупреждения о больших chunks. Основные причины:

- глобальный Bootstrap CSS;
- Bootstrap Icons;
- крупные клиентские компоненты каталога;
- общие зависимости Nuxt.

Возможные улучшения:

- лениво подключать тяжёлые компоненты;
- пересмотреть глобальные CSS;
- использовать локальные SVG-иконки вместо полного набора Bootstrap Icons;
- вынести админку в отдельный lazy chunk;
- отключить неиспользуемые Nuxt-модули.

### 20.4. Яндекс Карты

На страницах, где карта в первом экране, внешние запросы к Яндексу будут происходить сразу. На карточке объекта карта lazy-load и не грузится до скролла.

### 20.5. No external CRM

Заявки сейчас не уходят во внешнюю CRM, Telegram или email. Они сохраняются локально и отображаются в админке.

Для интеграции можно расширить `server/api/contact.post.ts`, добавив:

- Telegram Bot API;
- email;
- webhook CRM;
- Bitrix24/amoCRM;
- Google Sheets.

## 21. Рекомендации по дальнейшему развитию

### 21.1. Интеграции заявок

Добавить отправку заявки в Telegram или CRM. При этом локальное сохранение в `.data/contact-requests.json` можно оставить как резерв.

### 21.2. База данных

Перейти с JSON на Postgres/Supabase/SQLite, если:

- заявок станет много;
- будет несколько администраторов;
- появится история статусов;
- нужны роли пользователей;
- нужны отчёты.

### 21.3. SEO-посадочные страницы

Для лучшего SEO можно добавить отдельные индексируемые страницы:

- `/catalog/district/oktyabrskiy`;
- `/catalog/metro/rechnoy-vokzal`;
- `/catalog/finish/renovation`;
- `/catalog/mortgage`;
- `/catalog/cheap`;
- `/catalog/completed`;
- `/catalog/with-renovation`.

Сейчас фильтры работают query-параметрами, но для SEO лучше иметь чистые URL под отдельные кластеры запросов.

### 21.4. Фиды недвижимости

Можно подготовить XML/YML-фид для агрегаторов и рекламных систем.

### 21.5. Метрики

Рекомендуется подключить:

- Яндекс Метрику;
- цели на отправку заявки;
- цели на клик по телефону;
- цели на открытие формы;
- цели на просмотр карточки ЖК.

### 21.6. Производительность

Уже сделано:

- большие PNG заменены на WebP;
- карта объекта lazy-load;
- API закрыты от индексации.

Следующие шаги:

- уменьшить JS;
- оптимизировать CSS;
- lazy-load админку;
- проверить Lighthouse на production-домене;
- настроить CDN/cache headers для статических ассетов.

## 22. Troubleshooting

### 22.1. Ошибка входа в админку

Проверить `.env`:

```env
ADMIN_LOGIN=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

После изменения `.env` перезапустить сервер.

### 22.2. Карта не отображается

Проверить:

- задан `NUXT_PUBLIC_YANDEX_MAPS_API_KEY`;
- ключ разрешён для текущего домена;
- в консоли браузера нет ошибок загрузки `api-maps.yandex.ru`;
- координаты объекта корректные.

### 22.3. Заявки не видны в админке

Проверить:

- файл `.data/contact-requests.json`;
- права на запись в `.data`;
- успешность `POST /api/contact`;
- авторизацию в админке.

### 22.4. После деплоя пропали ЖК

Вероятная причина: не сохранена `.data`.

Нужно восстановить:

```text
.data/apartments.json
```

и настроить persistent storage.

### 22.5. После деплоя пропали фото

Вероятная причина: не сохранена директория:

```text
public/content/uploads/
```

### 22.6. Sitemap показывает неправильный домен

Проверить:

```env
NUXT_PUBLIC_SITE_URL=
```

После изменения пересобрать и перезапустить проект.

## 23. Контрольный чеклист перед production

Перед публикацией проверить:

- [ ] `npm run build` проходит.
- [ ] `NUXT_PUBLIC_SITE_URL` задан реальным доменом.
- [ ] `NUXT_PUBLIC_YANDEX_MAPS_API_KEY` задан и ограничен доменом.
- [ ] `ADMIN_LOGIN` задан.
- [ ] `ADMIN_PASSWORD` задан.
- [ ] `ADMIN_SESSION_SECRET` задан.
- [ ] `/robots.txt` открывается.
- [ ] `/sitemap.xml` открывается.
- [ ] `/admin` закрыт от индексации.
- [ ] `/api/` закрыт от индексации.
- [ ] форма заявки сохраняет запись.
- [ ] заявки видны в админке.
- [ ] карта отображается.
- [ ] карточки ЖК открываются по slug.
- [ ] `.data` сохраняется между релизами.
- [ ] `public/content/uploads` сохраняется между релизами.
- [ ] домен работает по HTTPS.
- [ ] в sitemap нет devtunnel/ngrok-домена.

## 24. Краткая карта файлов

```text
nuxt.config.ts
  Основная конфигурация Nuxt, runtimeConfig, headers, modules, CSS.

app/app.vue
  Root app, глобальная JSON-LD разметка, AppRequestModal.

app/layouts/default.vue
  Общий layout с navbar и footer.

app/pages/index.vue
  Главная.

app/pages/catalog/index.vue
  Каталог.

app/pages/catalog/[slug].vue
  Карточка ЖК.

app/pages/admin/index.vue
  Админка.

app/components/ApartmentCards.vue
  Основная логика каталога.

app/components/YandexMap.vue
  Карта.

app/components/AppRequestModal.vue
  Единая форма заявки.

app/utils/seo.ts
  SEO helpers, canonical, keywords, JSON-LD.

app/utils/yandexMaps.ts
  Загрузка API Яндекс Карт.

server/utils/adminStore.ts
  Чтение/запись ЖК и отзывов.

server/utils/submissionStore.ts
  Чтение/запись заявок и подписок.

server/utils/adminAuth.ts
  Авторизация админки.

server/routes/sitemap.xml.get.ts
  Sitemap.

server/routes/robots.txt.get.ts
  Robots.txt.
```

## 25. Правила внесения изменений

### 25.1. Изменения в данных

Если объект меняется через админку, актуальным источником становится `.data/apartments.json`.

Если меняется fallback в `app/data/apartments.ts`, это повлияет только на новые окружения, где ещё нет `.data/apartments.json`.

### 25.2. Изменения в SEO

Базовые SEO-настройки менять в:

```text
app/utils/seo.ts
```

SEO конкретной страницы менять в соответствующем `app/pages/...`.

### 25.3. Изменения в формах

Если нужно добавить поле заявки:

1. Добавить поле в форму.
2. Передать поле в `$fetch('/api/contact')`.
3. Добавить поле в `ContactRequestBody`.
4. Добавить поле в объект `submission`.
5. Добавить вывод в админку.
6. При необходимости обновить политику конфиденциальности.

### 25.4. Изменения в карточке ЖК

Основные места:

- `app/pages/catalog/[slug].vue` - страница объекта;
- `app/components/ApartmentCards.vue` - карточка в каталоге;
- `app/data/apartments.ts` - типы данных;
- `server/utils/adminStore.ts` - нормализация данных;
- `app/pages/admin/index.vue` - поля в админке.

Если добавляется новое поле объекта, его почти всегда нужно добавить во все эти места.
