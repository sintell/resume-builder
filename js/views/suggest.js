define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    'use strict';

    return Backbone.View.extend({
        keymap: {
            ARROW_DOWN: 40,
            ARROW_UP: 38,
            ESCAPE: 27,
            CARRIAGE_RETURN: 13
        },

        template: _.template($('#HH-ResumeBuilder-Component-Suggest').html()),

        events: {
            'click li': '_select'
        },

        initialize: function(data, options) {
            this.data = data;
            this.options = options;

            this.suggest = [];
            this.selected = null;
        },

        render: function() {
            var $results,
                borderWidth,
                data;

            data = {
                suggest: this.suggest
            };

            this.$el.html(this.template(data));

            $results = this.$el.find('.HH-Suggest-Results');
            borderWidth = parseInt($results.css('border-width'), 10);
            $results.css('min-width', (this.width - borderWidth * 2) + 'px');

            return this;
        },

        hide: function() {
            this.$el.empty();
        },

        updateSuggest: function(text, width) {
            var prevLength;

            this.width = width;

            if (text.length >= this.options.minInput) {
                prevLength = this.suggest.length;
                this.suggest = this._getSuggest(text);
                if (prevLength !== this.suggest.length) {
                    this.selected = null;
                }
            } else {
                this.suggest = [];
            }

            this.render();
        },

        processKey: function(event) {
            var $items;

            $items = this.$el.find('.HH-ResumeBuilder-SuggestItem');

            switch (event.which) {
                case this.keymap.ARROW_DOWN:
                    if (this.selected !== null) {
                        this.selected = (this.selected + 1) % $items.length;
                    } else {
                        this.selected = 0;
                    }
                    $($items.get(this.selected)).addClass('suggest-list__item_selected');

                    break;
                case this.keymap.ARROW_UP:
                    if (this.selected !== null) {
                        this.selected = (this.selected - 1) % $items.length;
                    } else {
                        this.selected = $items.length - 1;
                    }
                    $($items.get(this.selected)).addClass('suggest-list__item_selected');

                    break;
                case this.keymap.ESCAPE:
                    this.selected = null;
                    this.hide();

                    break;
                case this.keymap.CARRIAGE_RETURN:
                    this.trigger('selectSuggest', {
                        text: this.suggest[this.selected]
                    });
                    this.selected = null;

                    break;
            }
        },

        preventKeydown: function(event) {
            if (event.which === this.keymap.ARROW_UP) {
                event.preventDefault();
            }
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