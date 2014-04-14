define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/language.html',
    'text!templates/newLanguage.html'
], function(
    $,
    _,
    Backbone,
    LanguageTemplate,
    NewLanguageTemplate
) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(LanguageTemplate),

        newTemplate: _.template(NewLanguageTemplate),

        componentName: 'language',

        events: {
            'click .HH-ResumeSection-RemoveLanguage': '_removeLanguage'
        },

        initialize: function(options) {
            this.removed = false;
            this.availableLanguages = options.availableLanguages;
            this.levels = options.dictionary.get('language_level');
        },

        render: function() {
            var templateFunction = this.model.isNew() ? this.newTemplate : this.template;

            this.$el.html(templateFunction({
                language: this.model.attributes,
                languages: this.availableLanguages,
                levels: this.levels
            }));

            return this;
        },

        _removeLanguage: function() {
            this.removed = true;
            this.remove();
        }
    });
});
