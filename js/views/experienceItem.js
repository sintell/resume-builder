define([
    'jquery',
    'underscore',
    'backbone',
    'config',
    'utils',
    'views/baseArea',
    'views/suggest',
    'text!templates/experienceItem.html'
], function($, _, Backbone, Config, Utils, BaseArea, Suggest, ExperienceItemTemplate) {
    'use strict';

    return BaseArea.extend({
        className: 'HH-ResumeSection-Component-ExperienceItem',

        companySuggestUrl: Config.serverHost + '/autosuggest/multiprefix/v2?d=companies_RU&q=',

        template: _.template(ExperienceItemTemplate),

        events: {
            'keyup .HH-Experience-Item-Area': '_updateAreaSuggest',
            'keyup .HH-Experience-Item-Company': '_updateCompanySuggest',
            'focusout .HH-Experience-Item-Area': '_onAreaFocusOut',
            'focusout .HH-Experience-Item-Company': '_onCompanyFocusOut',
            'change .HH-Experience-Item-Current': '_changeCurrent'
        },

        initialize: function(data, options, experienceIndex) {
            this.area = {
                areas: options.area.attributes
            };

            this.experienceIndex = experienceIndex;

            this._orderArea(this.area);

            // инизиализирем саджсест списка городов
            this._initializeAreaSuggest();
            this._initializeCompanySuggest();

            this.industries = options.industries.models.map(function(model) {
                return model.attributes;
            });

            this.experience = data;

            this.experience.startDate = this._parseDate(this.experience.start);
            this.experience.endDate = this._parseDate(this.experience.end);
        },

        _parseDate: function(text) {
            var date = text ? new Date(text) : new Date();

            return {
                text: text && [
                    Utils.getMonths()[date.getMonth()].toLowerCase(),
                    date.getFullYear()
                ].join(' '),
                year: date.getFullYear(),
                month: date.getMonth() + 1
            };
        },

        render: function() {
            var data = {
                experience: this.experience,
                industries: this.industries,
                months: Utils.getMonths(),
                experienceIndex: this.experienceIndex
            };

            this.$el.html(this.template(data));

            this.areaSuggest.setElement(this.$('.HH-Suggest-Area'));
            this.companySuggest.setElement(this.$('.HH-Suggest-Company'));

            return this;
        },

        takeback: function(attributes) {
            var experience = {};

            experience.company = this.$('.HH-Experience-Item-Company').val();

            experience.area = this._findNodeByName(
                this.$('.HH-Experience-Item-Area').val(),
                this.area
            );

            experience.company_url = this.$('.HH-Experience-Item-CompanyUrl').val();
            experience.position = this.$('.HH-Experience-Item-Position').val();

            var startYear = this.$('.HH-Experience-Item-Start-Year').val();
            var startMonth = this.$('.HH-Experience-Item-Start-Month').val();

            var isCurrent = this.$('.HH-Experience-Item-Current').is(':checked');

            var endYear = this.$('.HH-Experience-Item-End-Year').val();
            var endMonth = this.$('.HH-Experience-Item-End-Month').val();

            experience.start = [startYear, startMonth, '01'].join('-');
            experience.end = isCurrent ? null : [endYear, endMonth, '01'].join('-');

            experience.description = this.$('.HH-Experience-Item-Description').val();
            experience.industry = {
                id: this.$('.HH-Experience-Item-Industry').val()
            };

            attributes.experience.push(experience);
        },

        _updateAreaSuggest: function(event) {
            this._updateAreaSuggestValues();
            this.areaSuggest.update(this.areaName, this.areaWidth);
            this.areaSuggest.processKey(event);
        },

        _updateCompanySuggest: function(event) {
            var that = this;

            this._updateCompanySuggestValues();

            if (!Utils.isIgnoringSuggestKeys(event.keyCode)) {
                $.getJSON(this.companySuggestUrl + this.companyName).success(function(data) {
                    if (!data) {
                        return;
                    }

                    that.companyData = data.items;

                    var companies = data.items.map(function(item) {
                        return item.text;
                    });

                    that.companySuggest.setData(companies, true);
                });
            }

            this.companySuggest.update(this.companyName, this.companyWidth);

            this.companySuggest.processKey(event);
        },

        _initializeAreaSuggest: function() {
            var data = [];
            this._getDataForSuggest(this.area, data);

            this.areaSuggest = new Suggest(data, {
                minInput: this.const.SUGGEST_MIN_INPUT
            });

            this.listenTo(this.areaSuggest, 'selectSuggest', this.onSelectAreaSuggest);
        },

        _initializeCompanySuggest: function() {
            var data = [];
            this._getDataForSuggest(this.area, data);

            this.companySuggest = new Suggest(data, {
                minInput: this.const.SUGGEST_MIN_INPUT,
                showOnSingle: true
            });

            this.listenTo(this.companySuggest, 'selectSuggest', this.onSelectCompanySuggest);
        },

        _updateAreaSuggestValues: function() {
            var input = this.$('.HH-Experience-Item-Area');

            this.areaName = input.val();
            this.areaWidth = input.width();
        },

        _updateCompanySuggestValues: function() {
            var input = this.$('.HH-Experience-Item-Company');

            this.companyName = input.val();
            this.companyWidth = input.width();
        },

        onSelectAreaSuggest: function(data) {
            this.$('.HH-Experience-Item-Area').val(data.text);
            this.areaSuggest.hide();
        },

        onSelectCompanySuggest: function(data) {
            this.$('.HH-Experience-Item-Company').val(data.text);

            var data = this._getCompanyDataByName(data.text);

            if (data) {
                this.$('.HH-Experience-Item-Area').val(data.area);
                this.$('.HH-Experience-Item-CompanyUrl').val(data.url);
                this.$('.HH-Experience-Item-Industry').val(data.industry_id);
            }

            this.companySuggest.hide();
        },

        _getCompanyDataByName: function(name) {
            return _.find(this.companyData, function(item) {
                return item.text === name;
            });
        },

        _onAreaFocusOut: function() {
            this.areaSuggest.hide();
        },

        _onCompanyFocusOut: function() {
            this.companySuggest.hide();
        },

        _changeCurrent: function() {
            var isChecked = this.$('.HH-Experience-Item-Current').is(':checked');

            this.$('.HH-Experience-Item-End-Year').prop('disabled', isChecked);
            this.$('.HH-Experience-Item-End-Month').prop('disabled',  isChecked);
        }
    });
});
