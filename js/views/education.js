define([
    'jquery',
    'underscore',
    'backbone',
    'views/suggest',
    'utils',
    'text!templates/primaryEducation.html',
    'text!templates/elementaryEducation.html'
], function(
    $,
    _,
    Backbone,
    Suggest,
    Utils,
    PrimaryEducationTemplate,
    ElementaryEducationTemplate
) {
    'use strict';

    return Backbone.View.extend({
        className: 'section__item',
        nameSuggestUrl: 'http://hh.ru/autosuggest/multiprefix/v2?d=university_RU&q=',
        resultSuggestUrl: 'http://hh.ru/autosuggest/multiprefix/v2?d=specialty_RU&q=',


        primaryTemplate: _.template(PrimaryEducationTemplate),
        elementaryTemplate: _.template(ElementaryEducationTemplate),

        componentName: 'education',

        events: {
            'click .HH-ResumeSection-RemoveEducation': '_removeEducation',

            'keyup .HH-EducationControl-NameInput': '_updateNameSuggest',
            'focusout .HH-EducationControl-NameInput': '_onNameFocusOut',

            'keyup .HH-EducationControl-ResultInput': '_updateResultSuggest',
            'focusout .HH-EducationControl-ResultInput': '_onResultFocusOut'
        },

        initialize: function(options) {

            this.removed = false;
            this.grade = options.grade;
            this._initializeNameSuggest();            
            this._initializeResultSuggest();   
        },

        render: function() {
            var templateFunction = this.grade === 'elementary' ? this.elementaryTemplate : this.primaryTemplate;
            this.$el.html(templateFunction({
                education: this.model.attributes
            }));

            return this;
        },

        _removeEducation: function() {
            this.removed = true;
            this.remove();
        },

        // Саджест для института
        _initializeNameSuggest: function() {
            this.nameSuggest = new Suggest();

            this.listenTo(this.nameSuggest, 'selectSuggest', this.onSelectNameSuggest);

        },

        _updateNameSuggest: function(event) {
            var that = this;
            this._updateNameSuggestValues();

            if (!Utils.isIgnoringSuggestKeys(event.keyCode)) {
                $.ajax({
                    url: this.nameSuggestUrl + this.nameName,
                    dataType: 'jsonp',
                    jsonp: 'p'
                }).success(function(data) {
                    if (!data) {
                        return;
                    }

                    that.nameData = data.items;

                    var names = data.items.map(function(item) {
                        return item.text;
                    });

                    that.nameSuggest.setData(names, true);
                });
            }
            
            this.nameSuggest.update(this.nameName, this.nameWidth);
            this.nameSuggest.processKey(event);

            var $nameSuggestEl = this.$('.HH-Education-Name-Suggest');

            this.nameSuggest.setElement($nameSuggestEl);
        },

        _updateNameSuggestValues: function() {
            var input = this.$('.HH-EducationControl-NameInput');

            this.nameName = input.val();
            this.nameWidth = input.width();
        },

        onSelectNameSuggest: function(data) {
            if (data) {
                this.$('.HH-EducationControl-NameInput').val(data.text);
            }
            this.nameSuggest.hide();

        },

        _onNameFocusOut: function() {
            this.nameSuggest.hide();
        },

        // Саджест для факультета
        // Не работает через автосаджест

        // Саджест для специальности
        _initializeResultSuggest: function() {
            this.resultSuggest = new Suggest();

            this.listenTo(this.resultSuggest, 'selectSuggest', this.onSelectResultSuggest);
        },

        _updateResultSuggest: function(event) {
            var that = this;
            this._updateResultSuggestValues();

            if (!Utils.isIgnoringSuggestKeys(event.keyCode)) {
                $.ajax({
                    url: this.resultSuggestUrl + this.resultName,
                    dataType: 'jsonp',
                    jsonp: 'p'
                }).success(function(data) {
                    if (!data) {
                        return;
                    }

                    that.resultData = data.items;

                    var results = data.items.map(function(item) {
                        return item.text;
                    });

                    that.resultSuggest.setData(results, true);
                });
            }

            this.resultSuggest.update(this.resultName, this.resultWidth);
            this.resultSuggest.processKey(event);

            var $resultSuggestEl = this.$('.HH-Education-Result-Suggest');
            this.resultSuggest.setElement($resultSuggestEl);
        },

        _updateResultSuggestValues: function() {
            var input = this.$('.HH-EducationControl-ResultInput');

            this.resultName = input.val();
            this.resultWidth = input.width();
        },

        onSelectResultSuggest: function(data) {
            if (data) {
                this.$('.HH-EducationControl-ResultInput').val(data.text);
            }
            this.resultSuggest.hide();
        },

        _onResultFocusOut: function() {
            this.resultSuggest.hide();
        },
    });
});
