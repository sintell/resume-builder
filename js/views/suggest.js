define([
    'jquery',
    'underscore',
    'backbone',
    'utils',
    'text!templates/suggest.html'
], function($, _, Backbone, Utils, SuggestTemplate) {
    'use strict';

    var TAGS_SUGGEST_TOP = '-10px';

    return Backbone.View.extend({
        keymap: {
            ARROW_DOWN: 40,
            ARROW_UP: 38,
            ESCAPE: 27,
            CARRIAGE_RETURN: 13
        },

        defaults: {
            maxElements: 7,
            minInput: 2
        },

        template: _.template(SuggestTemplate),

        events: {
            'mousedown .HH-ResumeBuilder-SuggestItem': '_select'
        },

        initialize: function(data, options) {
            this.data = data || [];
            this.options = options || {};

            this.minInput = this.options.minInput || this.defaults.minInput;
            this.maxElements = this.options.maxElements || this.defaults.maxElements;

            this.suggest = [];
            this.selected = null;
        },

        setData: function(data, forceUpdate) {
            this.data = data;

            if (forceUpdate) {
                this.update(this.text, this.width, this.tags);
            }
        },

        render: function() {
            var data = {
                suggest: this.suggest
            };

            this.$el.html(this.template(data));
            this.$('.HH-Suggest-Results').css('width', this.width + 'px').css('top', this.tags ? TAGS_SUGGEST_TOP : '0');

            return this;
        },

        hide: function() {
            this.$el.empty();
            this.isShow = false;
        },

        update: function(text, width, tags) {
            var prevLength;

            this.width = width;
            this.text = text;
            this.tags = tags;

            if (text.length >= this.minInput) {
                prevLength = this.suggest.length;
                this.suggest = this._getSuggest(text);

                if (prevLength !== this.suggest.length) {
                    this.selected = null;
                }
            } else {
                this.suggest = [];
                this.selected = null;
            }

            this.isShow = this.suggest.length > 0;

            this.render();
        },

        getSelected: function() {
            return this.selected;
        },

        processKey: function(event) {
            var $items;

            $items = this.$el.find('.HH-ResumeBuilder-SuggestItem');

            if (event) {
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
                        if (this.selected !== null) {
                            this.trigger('selectSuggest', {
                                text: this.suggest[this.selected]
                            });
                            this.selected = null;
                        }

                        break;
                }
            }
        },

        preventKeydown: function(event) {
            if (event.which === this.keymap.ARROW_UP) {
                event.preventDefault();
            }
        },

        _getSuggest: function(text) {
            var result = [],
                that = this;

            var textPreprocessing = function(str) {
                // toLowerCase
                // to russian keyboard
                // replace ё to e
                var rus = Utils.toRussianKeyboard(str.toLowerCase());
                return Utils.replaceRussianE(rus);
            };

            var processedText = textPreprocessing(text);

            this.data.forEach(function(area) {
                if (
                    // Аналогично str.startWith(substr)
                    textPreprocessing(area).indexOf(processedText) === 0 &&
                    result.length < that.maxElements
                ) {
                    result.push(area);
                }
            });

            if (
                !this.options.showOnSingle &&
                result.length === 1 &&
                textPreprocessing(result[0]) === processedText
            ) {
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