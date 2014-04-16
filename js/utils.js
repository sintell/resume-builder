define(['underscore'],function(_) {
   var Utils = function() {

       var isIOS =  /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

       this.keycodes = {
           ARROW_DOWN: 40,
           ARROW_UP: 38,
           ENTER: 13
       };

       // Данный метот применим только для входного текста в нижнем регистре,
       // т.к. символ '`' при нажатом капс-логе выглядит и одинаково.
       // В итоге, при написании слова RJHJK`D - (КОРОЛЁВ) мы
       // не можем определить, какая буква ё в строке, большая или маленькая.
       // И, чтобы быть честым, мы гарантируем корректность выполнения только
       // дя входного текста в нижнем регистре.
       // При этом, функция не заменяет символы, которым нет соответствия на русской клавиатуре.
       this.toRussianKeyboard = function(text) {
           var keyboard = {
               'q' : 'й',
               'w' : 'ц',
               'e' : 'у',
               'r' : 'к',
               't' : 'е',
               'y' : 'н',
               'u' : 'г',
               'i' : 'ш',
               'o' : 'щ',
               'p' : 'з',
               '[' : 'х',
               ']' : 'ъ',
               'a' : 'ф',
               's' : 'ы',
               'd' : 'в',
               'f' : 'а',
               'g' : 'п',
               'h' : 'р',
               'j' : 'о',
               'k' : 'л',
               'l' : 'д',
               ';' : 'ж',
               '\'' : 'э',
               'z' : 'я',
               'x' : 'ч',
               'c' : 'с',
               'v' : 'м',
               'b' : 'и',
               'n' : 'т',
               'm' : 'ь',
               ',' : 'б',
               '.' : 'ю',
               '`' : 'ё'
           };

            return _.reduce(text, function(memo, c) {
               var rus = keyboard[c];
               return memo + (rus || c);
           }, '');
       };

       this.replaceRussianE = function(text) {
            return text.replace('ё','е');
       };

       this.formatUpdateTime = function(updateTime) {
           var date = new Date(updateTime);
           var SECOND = 1000;
           var MINUTE = SECOND * 60;
           var HOUR = MINUTE * 60;
           var DAY = HOUR * 24;
           var dateString = '';

           // TODO: что будет, если у пользователя некорректно проставлено время?
           var now = new Date();
           var diff = now - date;

           if (diff < 0) {
               return [
                   [date.getDate(), this.monthNameByNum(date.getMonth()), date.getFullYear()].join(' '),
                   [date.getHours(), date.getMinutes()].join(':')
               ].join(' ');
           } else if (diff < 60 * SECOND) {
               var seconds = Math.round(diff/SECOND);
               dateString = [seconds, this.secondsToRussian(seconds), 'назад'].join(' ');
           } else if (diff < 60 * MINUTE) {
               var minutes = Math.round(diff/MINUTE);
               dateString = [minutes, this.minutesToRussian(minutes), 'назад'].join(' ');
           } else if (diff < 24 * HOUR) {
               var hours = Math.round(diff/HOUR);
               dateString = [hours, this.hoursToRussian(hours), 'назад'].join(' ');
           } else if (diff < 30 * DAY) {
               var days = Math.round(diff/DAY);
               dateString = [days, this.daysToRussian(days), 'назад'].join(' ');
           } else {
               return [date.getDate(), this.monthNameByNum(date.getMonth()), date.getFullYear()].join(' ');
           }

           return dateString;
       };

       this.getCookie = function(cookieName) {
           var cookieValue = '';
           document.cookie.split(';').some(function(cookie) {
               var cookieData = cookie.split('=');
               if (cookieData[0].trim() === cookieName) {
                   cookieValue = cookieData[1].trim();
                   return true;
               }
           }, this);
           return cookieValue;
       };

       // it`s a king of magic
       // использование: numeralToRussian(число обьектов, массив значений строки для 1, 4 и 5 обьектов)
       this.numeralToRussian = function(number, titles) {
           var cases = [2, 0, 1, 1, 1, 2],
               twoDigits = number % 100,
               oneDigit = number % 10,
               index;

           if ((twoDigits > 4) && (twoDigits < 20)) {
                index = 2;
           } else {
               index = cases[(oneDigit < 5) ? oneDigit : 5];
           }

           return titles[index];
       };

       this.secondsToRussian = function(val) {
            return this.numeralToRussian(val, ['секунду', 'секунды', 'секунд']);
       };

       this.minutesToRussian = function(val) {
           return this.numeralToRussian(val, ['минуту', 'минуты', 'минут']);
       };

       this.hoursToRussian = function(val) {
           return this.numeralToRussian(val, ['час', 'часа', 'часов']);
       };

       this.daysToRussian = function(val) {
           return this.numeralToRussian(val, ['день', 'дня', 'дней']);
       };

       this.monthsToRussian = function(val) {
           return this.numeralToRussian(val, ['месяц', 'месяца', 'месяцев']);
       };

       this.isIOS = function() {
           return isIOS;
       }

       var months = [
           'Январь',
           'Февраль',
           'Март',
           'Апрель',
           'Май',
           'Июнь',
           'Июль',
           'Август',
           'Сентябрь',
           'Октябрь',
           'Ноябрь',
           'Декабрь'
       ];

       this.getMonths = function() {
           return months;
       },

       this.monthNameByNum = function(val) {
            var dict = [
                'января',
                'февраля',
                'марта',
                'апреля',
                'мая',
                'июня',
                'июля',
                'августа',
                'сентября',
                'октября',
                'декабря'];

           return dict[val];
       };

       this.isIgnoringSuggestKeys = function(keyCode) {
           var IGNORING_KEYS = [
               this.keycodes.ARROW_DOWN,
               this.keycodes.ARROW_UP,
               this.keycodes.ENTER
           ];

           return IGNORING_KEYS.indexOf(keyCode) !== -1;
       };
   };

    return new Utils();
});