# School resume builder

## Настройки
На данный момент токен авторизации захардкожен в `js/app.js:19:27`

Порты и url переадресации можно заменить в файле конфигурации 
`config/config.js`

---

`apiUrl` - базовый адрес api

`employerSuggestUrl` - адрес, по которому доступен список компаний, зарегистрированных на HH
(поподробне [тут](https://github.com/hhru/api/blob/7f443c4548e4d5b98371600d9061746eea610eff/docs/employers.md))

`staticServerUrl` - строка, полный url сервера статики
(по-умолчанию `'http://0.0.0.0:8080'`)

`serverHost` - строка, host-url сервера статики
(по-умолчанию `'http://0.0.0.0'`)

`staticServerPort` - число, порт, на котором доступен сервер статики
(по-умолчанию `8080`)

`oauthServerPort` - число, порт на котором доступен oauth сервер
(по-умолчанию `8081`)

`redirectUri` - строка вида `'&redirect_uri=http://example.com'`, используется для переадресации с сервера oauth hh.ru на данный oauth сервер 
(по-умолчанию `''`)

`clientId` - идентификатор клиентского приложения
(можно получить [тут](https://dev.hh.ru]))

`clientSecret` - секретный токен приложения
(можно получить [тут](https://dev.hh.ru]))

## Запуск
Перед началом работы следует выполнить `npm update && npm install` в директории проекта

Команда `grunt default` запускает сервер статики (по-умолчанию [http://0.0.0.0:8080](http://0.0.0.0:8080)), и сервер oauth на портах указанных в файле конфигурации.

Команда `grunt oauth` запускает только oauth сервер с stack trace для отладки.

Команда `grunt forever:oauth:start` запускает oauth сервер в фоновом режиме.

Команда `grunt forever:oauth:stop` останавливает oauth сервер. 

Команда `grunt forever:oauth:restart` перезапускает oauth сервер.