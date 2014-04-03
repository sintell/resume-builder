define(["underscore"],function(_) {
   var Utils = function() {
       // только для lowercase
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
           var dateString = "";

           // TODO: что будет, если у пользователя некорректно проставлено время?
           var now = new Date();
           var diff = now - date;

           if (diff < 60 * SECOND) {
               var seconds = Math.round(diff/SECOND);
               dateString = [seconds, this.secondsToRussian(seconds), 'назад'].join(' ');
           } else if (diff < 60 * MINUTE) {
               var minutes = Math.round(diff/MINUTE);
               dateString = [minutes, this.minutesToRussian(minutes), 'назад'].join(' ');
           } else if (diff < 24 * HOUR) {
               var hours = Math.round(diff/HOUR);
               dateString = [hours, this.hoursToRussian(hours), 'назад'].join(' ');
           } else {
               var days = Math.round(diff/DAY);
               dateString = [days, this.daysToRussian(days), 'назад'].join(' ');
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
           var cases = [2, 0, 1, 1, 1, 2];
           return titles[(number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
       };

       this.secondsToRussian = function(val) {
            return this.numeralToRussian(val, ["секунда", "секунды", "секунд"]);
       };

       this.minutesToRussian = function(val) {
           return this.numeralToRussian(val, ["минута", "минуты", "минут"]);
       };

       this.hoursToRussian = function(val) {
           return this.numeralToRussian(val, ["час", "часа", "часов"]);
       };

       this.daysToRussian = function(val) {
           return this.numeralToRussian(val, ["день", "дня", "дней"]);
       };

       this.monthsToRussian = function(val) {
           return this.numeralToRussian(val, ["месяц", "месяца", "месяцев"]);
       };

       this.isIOS = function() {
           return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
       }
   };

    return new Utils();
});