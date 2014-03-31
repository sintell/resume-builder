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

`serverHost` - строка, host-url сервера статики

`staticServerPort` - число, порт, на котором доступен сервер статики

`oauthServerPort` - число, порт на котором доступен oauth сервер

`redirectUri` - строка вида `'&redirect_uri=http://example.com'`, используется для переадресации с сервера oauth hh.ru на данный oauth сервер 

`clientId` - идентификатор клиентского приложения
(можно получить [тут](https://dev.hh.ru]))

`clientSecret` - секретный токен приложения
(можно получить [тут](https://dev.hh.ru]))

## Запуск
Перед началом работы следует выполнить `npm update && npm install` в директории проекта и скопировать файл `config/config.js.ex` в `config/config.js`.

Команда `grunt default` запускает сервер статики (по-умолчанию [http://0.0.0.0:8080](http://0.0.0.0:8080)), и сервер oauth на портах указанных в файле конфигурации.

Команда `grunt oauth` запускает только oauth сервер с stack trace для отладки.

Команда `grunt forever:oauth:start` запускает oauth сервер в фоновом режиме.

Команда `grunt forever:oauth:stop` останавливает oauth сервер. 

Команда `grunt forever:oauth:restart` перезапускает oauth сервер.
