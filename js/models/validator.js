define(['underscore', 'backbone', 'models/validationRules'], function(_, Backbone, ValidationRules) {
    'use strict';

    var validators = {};

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
                var errors = [];
                var r = that.rules.get(field.name);
                _.each(r, function(rule, ruleName) {
                    var errorText = Validator.prototype.validators[ruleName](field.value, rule);
                    if( !_.isUndefined(errorText) ) {
                        errors.push[errorText];
                    }
                }, this);
                console.log(errors);
                return errors;
            }
        };
    };

    Validator.prototype.validators = (function(){

        var hasValue = function(value) {
            return !(_.isNull(value) || _.isUndefined(value) || (_.isString(value) && value.trim() === ''));
        };

        var isNumber = function(value) {
            return _.isNumber(value) || (_.isString(value) && value.match('/^d+$/'));
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
                }             },
            max_count: function(value, maxCount) {
                if (_.isArray(value) && value.length > maxCount) {
                    return "Необходимо выбрать максимум значений";
                } 
            },
            min_value: function(value, minValue) {
                if (isNumber(value) && value < minValue) {
                    return "Минимальное значение";
                } 
            },
            max_value: function(value, maxValue) {
                if (isNumber(value) && value > maxValue) {
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
                }             },
            regexp: function(value, regexp) {
                if (!(new RegExp(regexp)).test(value))    {
                    return "Поле содержит недопустимые символы";
                } 
            }
        };
    }());

    return Validator;
});
