define([
    'jquery',
    'underscore',
    'backbone',
    'views/language',
    'text!templates/languageList.html'
], function(
    $,
    _,
    Backbone,
    LanguageView,
    LanguageListTemplate
) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(LanguageListTemplate),

        componentName: 'language-list',

        events: {
            'click .HH-ResumeSection-AddLanguage': '_addLanguage'
        },

        initialize: function(options) {
            this.options = options;
        },

        render: function() {
            this.$el.html(this.template(this.model.attributes));

            this.$('.HH-ResumeSection-Languages').append(this.languages.map(function(language) {
                return language.render().el;
            }));

            return this;
        },

        fill: function(attributes) {
            var that = this;

            if (!attributes.language) {
                this.languages = [];
                return;
            }

            this.languages = attributes.language.map(function (language) {
                return new LanguageView($.extend(
                    {},
                    that.options, {
                        model: new Backbone.Model(language),
                        availableLanguages: that.availableLanguages
                    }
                ));
            });
        },

        takeback: function(attributes) {
            attributes.language = attributes.language || [];

            this.languages.forEach(function(language) {
                var $id = language.$('.HH-LanguageControl-IdSelect'),
                    $level = language.$('.HH-LanguageControl-LevelSelect');

                if (!language.removed) {
                    attributes.language.push({
                        id: language.model.isNew() ? $id.val() : language.model.id,
                        level: {
                            id: $level.val()
                        }
                    });
                }
            });
        },

        _addLanguage: function() {
            var language;

            this._updateAvailableLanguages();

            language = new LanguageView($.extend(
                {},
                this.options, {
                    model: new Backbone.Model(),
                    availableLanguages: this.availableLanguages
                }
            ));

            this.languages.push(language);
            this.$('.HH-ResumeSection-Languages').append(language.render().el);
            language.$('.HH-ResumeSection-Control').toggleClass('control_viewing control_editing');
        },

        _updateAvailableLanguages: function() {
            var languages = [],
                that = this;

            this.options.languages.forEach(function(language) {
                languages.push({id: language.id, name: language.get('name')});
            });

            // Удаляет из списка доступых языков те, которые уже сохранены в резюме и те, которые уже выбраны в селекте
            languages = languages.filter(function(language) {
                return !that.languages.some(function(unavailableLanguage) {
                    return language.id === unavailableLanguage.model.id;
                }) && !$.makeArray(that.$('.HH-LanguageControl-IdSelect')).some(function(unavailableLanguage) {
                    return language.id === unavailableLanguage.value;
                });
            });

            this.availableLanguages = languages;
        }
    });
});
