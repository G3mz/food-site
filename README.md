# 🔥 Печь & Борщ — Домашняя кулинария

Сайт доставки домашней еды ручной работы: пельмени, вареники, блинчики, супы, салаты. Динамический контент из PocketBase CMS, корзина и оформление заказов.

---

## 📋 Содержание

- [Технологии](#-технологии)
- [Архитектура](#-архитектура)
- [Структура проекта](#-структура-проекта)
- [Быстрый старт](#-быстрый-старт)
- [PocketBase — коллекции](#-pocketbase--коллекции)
- [Админ-панель](#-админ-панель)
- [Функционал сайта](#-функционал-сайта)
- [Деплой на Netlify](#-деплой-на-netlify)
- [Туннель для удалённого доступа](#-туннель-для-удалённого-доступа)
- [Переезд на VPS](#-переезд-на-vps)
- [Конфигурация](#-конфигурация)

---

## 🛠 Технологии

| Компонент | Технология |
|-----------|-----------|
| Фронтенд | HTML5, CSS3, Vanilla JS |
| Шрифты | Google Fonts (Nunito, Caveat) |
| CMS / Бэкенд | [PocketBase](https://pocketbase.io/) (self-hosted) |
| Хостинг фронтенда | [Netlify](https://netlify.com/) |
| Туннель (временно) | Cloudflare Tunnel (`cloudflared`) |
| Уведомления о заказах | Telegram через Google Apps Script webhook |

---

## 🏗 Архитектура

```
┌──────────────┐     API      ┌──────────────────┐
│   Netlify     │ ──────────► │   PocketBase     │
│  (фронтенд)   │ ◄────────── │   (CMS + API)    │
│  статика      │              │   localhost:8090  │
└──────────────┘              └──────────────────┘
       │                              │
       │  заказ                       │  заказ
       ▼                              ▼
┌──────────────┐              ┌──────────────────┐
│  Telegram     │              │  Коллекция       │
│  webhook      │              │  orders          │
└──────────────┘              └──────────────────┘
```

- **Фронтенд** — статический HTML/JS/CSS на Netlify
- **PocketBase** — headless CMS: товары, настройки, заказы
- **Fallback** — если PocketBase недоступен, сайт показывает встроенные данные из JS
- **Заказы** — отправляются параллельно в PocketBase (если доступен) и в Telegram webhook

---

## 📁 Структура проекта

```
site-main/
├── index.html              # Главная страница (динамические контейнеры)
├── css/
│   └── style.css           # Все стили (адаптив, модалки, карточки)
├── js/
│   └── main.js             # Логика: API, рендер, корзина, заказы
├── img/                    # Локальные изображения товаров
│   ├── pelmenidom.jpeg
│   ├── vareniki.png
│   └── vareniki_vishnya.png
├── pb_collections/         # JSON-схемы коллекций PocketBase
│   ├── products.json
│   ├── orders.json
│   ├── site_settings.json
│   ├── seed_products.json
│   └── seed_settings.json
├── seed.js                 # Скрипт импорта данных в PocketBase
├── pocketbase/             # Исполняемый файл PocketBase + данные
├── cloudflared.exe         # Cloudflare Tunnel
├── netlify.toml            # Конфигурация Netlify
├── .gitignore
└── README.md
```

---

## 🚀 Быстрый старт

### 1. Запустить PocketBase

```bash
# Windows
cd pocketbase
.\pocketbase.exe serve

# Linux / macOS
cd pocketbase
./pocketbase serve
```

PocketBase запустится на `http://127.0.0.1:8090`

### 2. Создать супер-пользователя (первый запуск)

```bash
# Windows
.\pocketbase\pocketbase.exe superuser upsert admin@pech-borsh.ru admin123456

# Linux / macOS
./pocketbase/pocketbase superuser upsert admin@pech-borsh.ru admin123456
```

### 3. Создать коллекции

Открой `http://127.0.0.1:8090/_/`, зайди в админку и создай 3 коллекции. Схемы описаны в `pb_collections/*.json`.

### 4. Импортировать начальные данные

```bash
node seed.js
```

Создаст 30 товаров и 13 настроек сайта.

### 5. Открыть сайт

Запусти Live Server (VS Code) или любой локальный сервер. Сайт подтянет данные из PocketBase автоматически.

---

## 🗄 PocketBase — коллекции

### `products` — Товары

| Поле | Тип | Обязательное | Описание |
|------|-----|:---:|----------|
| `name` | text | ✅ | Название товара |
| `description` | text | ✅ | Краткое описание |
| `price` | number | ✅ | Цена в рублях |
| `image` | text | ❌ | URL или путь к картинке |
| `category` | select | ✅ | Категория: `meat`, `soups`, `desserts` |
| `is_hit` | bool | ❌ | Флаг «Хит продаж» |
| `sort_order` | number | ❌ | Порядок сортировки |
| `composition` | text | ❌ | Состав товара |
| `preparation` | text | ❌ | Инструкция по приготовлению |

**Права:** List/View — публично, Create/Update/Delete — авторизованные

### `orders` — Заказы

| Поле | Тип | Обязательное | Описание |
|------|-----|:---:|----------|
| `customer_name` | text | ✅ | Имя клиента |
| `phone` | text | ✅ | Телефон |
| `address` | text | ✅ | Адрес доставки |
| `items` | text | ✅ | JSON со списком товаров |
| `payment` | text | ✅ | Способ оплаты |
| `persons` | number | ❌ | Количество персон |
| `sauces` | text | ❌ | Выбранные соусы |
| `total` | number | ✅ | Сумма заказа |
| `status` | select | ✅ | Статус: `new`, `processing`, `delivered`, `cancelled` |

**Права:** Create — публично, List/View/Update/Delete — авторизованные

### `site_settings` — Настройки сайта

| Поле | Тип | Обязательное | Описание |
|------|-----|:---:|----------|
| `key` | text | ✅ | Уникальный ключ настройки |
| `value` | text | ✅ | Значение настройки |

**Права:** List/View — публично, Create/Update/Delete — авторизованные

**Ключи настроек:**

| Ключ | Описание |
|------|----------|
| `promo_ticker` | Бегущая строка акций |
| `hero_badge` | Бейдж в hero-секции |
| `hero_title` | Заголовок hero |
| `hero_description` | Описание hero |
| `stat_clients` | Статистика: клиенты (число) |
| `stat_clients_label` | Статистика: клиенты (подпись) |
| `stat_delivery` | Статистика: доставка (число) |
| `stat_delivery_label` | Статистика: доставка (подпись) |
| `stat_years` | Статистика: годы (число) |
| `stat_years_label` | Статистика: годы (подпись) |
| `phone` | Контактный телефон |
| `footer_tagline` | Слоган в футере |
| `footer_copyright` | Копирайт в футере |

---

## 🔐 Админ-панель

**URL:** `http://127.0.0.1:8090/_/` (локально) или через Cloudflare Tunnel

**Логин:** `admin@pech-borsh.ru`
**Пароль:** `admin123456`

### Возможности

- **Товары** — CRUD; цены, картинки, категории, флаг «Хит», состав, приготовление
- **Настройки** — менять все тексты: промо-строка, hero, статистика, телефон, футер
- **Заказы** — просмотр, смена статуса (new → processing → delivered)
- **Файлы** — загрузка изображений через встроенный менеджер

Изменения применяются на сайте после обновления страницы.

---

## 🎯 Функционал сайта

### Каталог товаров
- Динамический рендеринг из PocketBase
- Фильтрация по категориям: Мясное, Супы, Десерты
- Поиск по названию
- Карточки с картинкой, названием, описанием, ценой

### Модалка товара
- Открывается по клику на карточку
- Крупная картинка с отступами и скруглениями
- Полное описание, состав, приготовление
- Бейдж «Хит продаж»
- Кнопка «В корзину» (компактная, справа внизу)
- Закрытие: клик по оверлею, кнопка ×, Escape

### Слайдер хитов продаж
- Автопрокрутка
- Навигация стрелками и точками
- Свайп на мобильных

### Корзина
- Добавление / изменение количества / удаление
- Выбор соусов (+50 ₽ каждый)
- Итого с учётом соусов

### Оформление заказа
- Адрес доставки, способ оплаты, количество персон
- Маска ввода телефона, валидация
- Отправка в **PocketBase** + **Telegram** параллельно

### Адаптивность
- Мобильная навигация (нижняя панель)
- Бургер-меню
- Адаптивные карточки и модалки
- PWA-ready (meta-теги)

---

## 🚢 Деплой на Netlify

### Через CLI

```bash
# Установить и авторизоваться
npm install -g netlify-cli
netlify login

# Создать deploy-папку (без PocketBase файлов)
mkdir deploy_tmp
cp index.html netlify.toml .gitignore deploy_tmp/
cp -r css js img deploy_tmp/

# Задеплоить
netlify deploy --dir deploy_tmp --prod

# Удалить временную папку
rm -rf deploy_tmp
```

### Через GitHub

1. Загрузить проект в GitHub (без `pocketbase/`, `cloudflared.exe`, `pb_collections/`)
2. Подключить репозиторий в Netlify
3. Настроить: publish directory = `.`

---

## 🌐 Туннель для удалённого доступа

Для доступа к PocketBase с других устройств (пока нет VPS):

```bash
# Скачать cloudflared (Windows)
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"

# Запустить туннель
.\cloudflared.exe tunnel --url http://127.0.0.1:8090
```

Публичный URL вида `https://xxx-yyy-zzz.trycloudflare.com`

**После получения URL:**
1. Обновить `PB_URL` в `js/main.js`
2. Передеплоить на Netlify

**⚠️ Ограничения:**
- URL меняется при каждом перезапуске
- Туннель работает пока запущен `cloudflared`
- Не подходит для production

---

## 🖥 Переезд на VPS

Для стабильной работы перенесите PocketBase на VPS:

### 1. Установить PocketBase на сервер

```bash
wget https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_0.23.4_linux_amd64.zip
unzip pocketbase_0.23.4_linux_amd64.zip
chmod +x pocketbase
./pocketbase serve --http=0.0.0.0:8090
```

### 2. Настроить автозапуск (systemd)

```ini
# /etc/systemd/system/pocketbase.service
[Unit]
Description=PocketBase
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/pocketbase
ExecStart=/opt/pocketbase/pocketbase serve --http=0.0.0.0:8090
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable pocketbase
sudo systemctl start pocketbase
```

### 3. Настроить Nginx (reverse proxy + HTTPS)

```nginx
server {
    listen 80;
    server_name pb.yourdomain.ru;

    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo certbot --nginx -d pb.yourdomain.ru
```

### 4. Обновить PB_URL

В `js/main.js` заменить:
```js
const PB_URL = 'https://pb.yourdomain.ru';
```

Передеплоить на Netlify. Туннель больше не нужен.

---

## ⚙️ Конфигурация

### PB_URL

Адрес PocketBase. Определяется в `js/main.js`:

```js
const PB_URL = window.__PB_URL__ || 'https://pb.yourdomain.ru';
```

Можно задать через глобальную переменную `window.__PB_URL__` до загрузки скрипта.

### Fallback-данные

Если PocketBase недоступен (таймаут 3 сек), сайт переключается на встроенные данные:
- `FALLBACK_SETTINGS` — настройки сайта (13 ключей)
- `FALLBACK_PRODUCTS` — 30 товаров с составом и приготовлением

### Telegram Webhook

URL для уведомлений о заказах задан в функции `sendToTelegram()` в `main.js`. Замените на свой при необходимости.

---

## 📝 Лицензия

Частный проект. Все права защищены.
