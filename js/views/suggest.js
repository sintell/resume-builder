define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    'use strict';

    return Backbone.View.extend({
        template: _.template($('#HH-ResumeBuilder-Component-Suggest').html()),

        events: {
            'click li': '_select'
        },

        initialize: function(data, options) {
            this.data = data;
            this.options = options;

            this.suggest = [];
        },

        render: function() {
            var data;

            data = {
                suggest: this.suggest
            };

            this.$el.html(this.template(data));
            this.$el.find('.HH-Suggest-Results').css('width', this.width + 'px');

            return this;
        },

        hide: function() {
            this.$el.empty();
        },

        updateSuggest: function(text, width) {
            this.width = width;

            if (text.length >= this.options.minInput) {
                this.suggest = this._getSuggest(text);
            } else {
                this.suggest = [];
            }

            this.render();
        },

        _getSuggest: function(text) {
            var result = [];

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

            var toRussianKeyboard = function(str){
                return _.reduce(str, function(memo, c) {
                    return memo + (keyboard[c.toLowerCase()] || c);
                }, '');
            };

            _.each(this.data, function(area) {
                if (toRussianKeyboard(area.toLowerCase()).replace('ё','е').indexOf(
                    toRussianKeyboard(text.toLowerCase()).replace('ё','е')) === 0
                    ) {
                    result.push(area);
                }
            });

            if (
                result.length === 1 &&
                result[0].toLowerCase().replace('ё','e') === text.toLowerCase().replace('ё','e')
                )
            {
                return [];
            }

            return result;
        },

        _select: function(event) {
            this.trigger('selectSuggest', {
                text: $(event.currentTarget).text()
            });
        }
    });
});