define(['underscore', 'backbone', 'models/validationRules'], function(_, Backbone, ValidationRules) {
    'use strict';

    var Validator = function(options){
        this.rules = new ValidationRules({resume:{id:options}});
        var that = this;
        return {
            bind : function(){},
            unbind: function(){},
            validate: function(){},
            validateField: function(field) {
                // Выбираем из модели правил все правила применимые к полю field
                // Для каждого правила вызываем соотвествующий валидатор
                // Если валидатор вернул не пустую строку, то значит произошла ошибка и строка содержит ее описание
                var rules = that.rules.get(field.name);
                for(var ruleName in rules) {
                    var rule = rules[ruleName];
                    var errorText = Validator.prototype.validators[ruleName](field.value, rule);
                    console.log(errorText);
                    if( !_.isUndefined(errorText) ) {
                        return errorText;
                    }
                }
            }
        };
    };

    Validator.prototype.validators = (function(){

        var hasValue = function(value) {
            return !(_.isNull(value) || _.isUndefined(value) || (_.isString(value) && value.trim() === ''));
        };

        var isNumber = function(value) {
            return _.isNumber(value) || (_.isString(value) && /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value));
        };

        return {
            required: function(value, isRequired) {
                if (isRequired && !hasValue(value)) {
                    return "Это поле необходимо заполнить";
                }
            },
            min_length: function(value, minLength) {
                if (_.isString(value) && value.length < minLength) {
                    return "В этом поле не может быть менее символов";
                } 
            },
            max_length: function(value, maxLength) {
                if (_.isString(value) && value.length > maxLength) {
                    return "В этом поле не может быть более символов";
                } 
            },
            min_count: function(value, minCount) {
                if (_.isArray(value) && value.length < minCount) {
                    return "Необходимо выбрать минимум значений";
                }
            },
            max_count: function(value, maxCount) {
                if (maxCount && _.isArray(value) && value.length > maxCount) {
                    return "Необходимо выбрать максимум значений";
                } 
            },
            min_value: function(value, minValue) {
                // console.log(parseFloat(value, 10), "<", minValue)
                // console.log(parseFloat(value, 10) < minValue)
                // console.log(isNumber(value))
                if (isNumber(value) && parseFloat(value, 10) < minValue) {
                    return "Минимальное значение";
                } 
            },
            max_value: function(value, maxValue) {
                if (maxValue && isNumber(value) && parseFloat(value, 10) > maxValue) {
                    return "Максимальное значение";
                } 
            },
            min_date: function(value, minDate) {
                if (new Date(value) < new Date(minDate)) {
                    return "Минимальная дата";
                } 
            },
            max_date: function(value, maxDate) {
                if (new Date(value) > new Date(maxDate)) {
                    return "Максимальная дата";
                }
            },
            regexp: function(value, regexp) {
                if (!(new RegExp(regexp)).test(value))    {
                    return "Поле содержит недопустимые символы";
                } 
            }
        };
    }());

    return Validator;
});
