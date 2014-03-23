define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/accessTypeCompanyList.html'
], function(
    $,
    _,
    Backbone,
    AccessTypeCompanyListTemplate
    ) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'div',

        className: 'HH-ResumeSection-Component-AccessTypeCompanyList',

        componentName: 'access-type-company-list',

        suggestUrl: 'https://api.hh.ru/employers/?per_page=2000&text=',

        consts: {
            WHITE_LIST: 'whitelist',
            BLACK_LIST: 'blacklist',
            TIME_OUT: 500,
            SUGGEST_MIN_INPUT: 3
        },

        events: {
            'click .HH-AccessTypeCompanyList-Remove': '_remove',
            'keyup .HH-AccessTypeCompanyList-Input': '_onEnter',
            'click [name="HH-AccessTypeCompanyList-Item"]': '_select',
            'click .HH-AccessTypeCompanyList-Close': '_ok',
            'click .HH-AccessTypeCompanyList-Search': '_search'
        },

        template: _.template(AccessTypeCompanyListTemplate),

        initialize: function() {
            this.isShow = false;
            this.companies = [];
            this.suggest = [];
            this.input = '';
            this.searched = false;
        },

        fill: function() {
        },

        takeback: function() {
        },

        show: function(currentList) {
            var that = this;
            this.companies = [];
            this.suggest = [];
            this.input = '';

            var promises = [];

            currentList.forEach(function(item) {
                var element = {
                    id: parseInt(item.id, 10)
                };

                if (!item.name) {
                    promises.push(
                        $.when($.get(item.url)).then(function(responce) {
                            element.name = responce.name;
                        }));
                } else {
                    element.name = item.name;
                }

                that.companies.push(element);
            });

            $.when.apply(null, promises).then(function() {
                that.isShow = true;
                that.render();
            });
        },

        hide: function() {
            this.isShow = false;
            this.$el.empty();
        },

        render: function() {
            var data = {
                isShow: this.isShow,
                companies: this.companies,
                suggest: this.suggest,
                text: this.input,
                searched: this.searched
            };

            this.$el.html(this.template(data));

            return this;
        },

        _addCompany: function(id, name) {
            var company = {
                id: id,
                name: name,
                checked: false
            };

            this.companies.push(company);

            var element = _.findWhere(this.suggest, {id: id});

            if (element) {
                element.checked = true;
            }

            this.render();
        },

        _removeCompany: function(id) {
            this.companies = _.without(this.companies, _.findWhere(this.companies, {
                id: id
            }));

            var element = _.findWhere(this.suggest, {id: id});

            if (element) {
                element.checked = false;
            }

            this.render();
        },

        _updateSuggest: function(text) {
            var that = this,
                ajax = $.get(
                [that.suggestUrl, text].join('')
            );

            that.input = text;

            this.searched = true;

            $.when(ajax).then(function(responce) {
                that.suggest = responce.items.map(function(item) {
                    return {
                        id: parseInt(item.id, 10),
                        name: item.name,
                        checked: false
                    };
                });

                that._setChecked();
                that.render();
            });
        },

        _setChecked: function() {
            var that = this;

            that.suggest.forEach(function(item) {
                var element = _.findWhere(that.companies, {id: item.id});
                if (element) {
                    item.checked = true;
                }
            });
        },

        _select: function(event) {
            var element = $(event.currentTarget),
                isSelected = element.is(':checked'),
                id = parseInt(element.val(), 10),
                name = $(element).parent().find('.HH-AccessTypeCompanyList-Item-Name').text();

            if (isSelected) {
                this._addCompany(id, name);
            } else {
                this._removeCompany(id);
            }
        },

        _remove: function(event) {
            var id = $(event.currentTarget).data('hh-company-id');
            this._removeCompany(id);
        },

        _onEnter: function(event) {
            if(event.keyCode == 13){
                this._search();
            }
        },

        _search: function() {
            var text = $('.HH-AccessTypeCompanyList-Input').val(),
                that = this;

            that._updateSuggest(text);
        },

        _ok: function(event) {
            event.preventDefault();
            this.trigger('selectData', this.companies);
            this.hide();
        }
    });
});