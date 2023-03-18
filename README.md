# Задание

Разработка банковской системы хранения и операций над криптовалютными средствами.

## Функционал приложения:

*   [x] **Авторизация**
*   [x] **Управление счетами пользователя:** создание нового счёта, отображение списка  счетов, отображение баланса, просмотр истории транзакций
*   [x] **Переводы на счета или карты других пользователей**
*   [x] **Возможность производить валютные обмены**
*   [x] **Отображение банкоматов на карте**

### Необходимо, чтобы веб-приложение имело следующие разделы:
*   [x] **Форма входа пользователя**
*   [x] **Список счетов пользователя**
*   [x] **Просмотр информации о существующей карте**
*   [x] **Форма для перевода средств**
*   [x] **Подробная история баланса по карте**
*   [x] **Мониторинг курса валют и валютные переводы**
*   [x] **Страница отображения точек банком тов на карте**

## Оглавление

*   [Установка и запуск](#установка-и-запуск)


### Установка и запуск

1.  Склонируйте репозиторий на свой компьютер:
```shell
git clone https://gitlab.skillbox.ru/dmitrii_goff/dpo_js_advanced_diploma.git
```

2.  Перейдите в папку с сервером и установите необходимые пакеты:
```shell
cd dpo_js_advanced_diploma/project
npm install
```

4.  Запуск сервера осуществляется командой:
```shell
npm start
```

5.  Затем перейдите в папку веб-приложения и установите необходимые для его работы пакеты:
```shell
cd ../mvp
npm install
```
6. Запуск приложения на локальном сервере:
```shell
npm run dev
```
7. Сборка осуществляется коммандой:
```shell
npm run build
```