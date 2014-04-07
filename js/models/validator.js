define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';

    var hasValue = function(value) {
        return !(_.isNull(value) || typeof value === 'undefined' || (_.isString(value) && value.trim() === ''));
    };

    var isPositiveInteger = function(value) {
        return  /^[0-9]+$/.test(value);
    };

  
    var Validator = function(options){
        this.model = options.model;
        this.rules = this.model.conditions;
        var that = this;
        return {
            validateField: function(field) {
                // Выбираем из модели правил все правила применимые к полю field
                // Для каждого правила вызываем соотвествующий валидатор
                // Если валидатор вернул непустую строку, то значит произошла ошибка и строка содержит ее описание
                var rules = that.rules.getRulesFor(field.name),
                    errorText;

                if (typeof rules === 'undefined') {
                    console.log('1');

                    return;
                }

                if (Object.keys(rules).indexOf('required') !== -1) {
                    if (hasValue(field.value) || rules.required) {
                        errorText = that.validators.required(field.value, rules.required); 
                        if (typeof errorText !== 'undefined') {
                            return errorText;
                        }
                    } else {
                        return;
                    }
                }
                
                for (var ruleName in rules) {
                    var rule = rules[ruleName];
                    errorText = that.validators[ruleName](field.value, rule);
                    if (typeof errorText !== 'undefined') {
                        return errorText;
                    }
                }
            }
        };
    };

    Validator.prototype.validators = (function(){

        return {
            required: function(value, isRequired) {
                if (isRequired && !hasValue(value)) {
                    return "Это поле необходимо заполнить";
                }
            },
            min_length: function(value, minLength) {
                if (_.isString(value) && value.length < minLength) {
                    return "Минимальное количество символов в этом поле: " + minLength;
                } 
            },
            max_length: function(value, maxLength) {
                if (_.isString(value) && value.length > maxLength) {
                    return "Максимальное количество символов в этом поле: " + maxLength;
                } 
            },
            min_count: function(value, minCount) {
                if (_.isArray(value) && value.length < minCount) {
                    return "Минимальное количество выбраных элементов: " + minCount;
                }
            },
            max_count: function(value, maxCount) {
                if (maxCount && _.isArray(value) && value.length > maxCount) {
                    return "Максимальное количество выбраных элементов: " + maxCount;
                } 
            },
            min_value: function(value, minValue) {
                if (isPositiveInteger(value) && parseFloat(value, 10) < minValue) {
                    return "Значение не может быть меньше " + minValue;
                } 
            },
            max_value: function(value, maxValue) {
                if (maxValue && isPositiveInteger(value) && parseFloat(value, 10) > maxValue) {
                    return "Значение не может быть больше " + maxValue;
                } 
            },
            min_date: function(value, minDate) {
                if (new Date(value) < new Date(minDate)) {
                    return "Минимальная дата: " + minDate;
                } 
            },
            max_date: function(value, maxDate) {
                if (new Date(value) > new Date(maxDate)) {
                    return "Максимальная дата: " + maxDate;
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
