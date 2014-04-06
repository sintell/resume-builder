define([
    'jquery',
    'underscore',
    'backbone',
    'views/suggest',
    'config/config.js',
    'text!templates/skillSet.html'
], function($, _, Backbone, Suggest, Config, SkillSetTemplate) {
    'use strict';

    return Backbone.View.extend({
        tagName: 'div',

        className: 'HH-ResumeSection-Component-SkillSetTemplate',

        componentName: 'skill-set',

        template: _.template(SkillSetTemplate),

        const: {
           DELIMITER: ','
        },

        suggestUrl: Config.serverHost + '/autosuggest/multiprefix/v2?d=key_skill&q=',

        events: {
            'keyup .HH-SkillSet-Input': '_updateSuggest',
            'keydown .HH-SkillSet-Input': '_preventKeydown',
            'focusout .HH-SkillSet-Input': '_onFocusOut'
        },

        initialize: function() {
            this._initializeSuggest();
        },

        fill: function(attributes) {
            this.skills = attributes.skill_set.join(this.const.DELIMITER + ' ');
        },

        render: function() {
            var data = {
                skills: this.skills
            };

            this.$el.html(this.template(data));

            this.suggest.setElement(this.$('.HH-ResumeBuilder-Component-Suggest'));

            return this;
        },

        takeback: function(attributes) {
            this._updateValues();

            attributes.skill_set = this.skills
                .split(this.const.DELIMITER)
                .map(function(item) {
                    return $.trim(item);
                })
                .filter(function(item) {
                    return item != '';
                });
        },

        onSelectSuggest: function(data) {
            this._updateValues();

            var skills = this.skills.split(this.const.DELIMITER).map(function(item) {
                return $.trim(item);
            });

            if (skills.length) {
                skills[skills.length - 1] = data.text;
            }

            this.$('.HH-SkillSet-Input').val(skills.join(this.const.DELIMITER + ' '));

            this.suggest.hide();

            this.$('.HH-SkillSet-Input').focus();
        },

        _updateValues: function() {
            var input = this.$('.HH-SkillSet-Input');

            this.skills = input.val();
            this.width = input.outerWidth();
        },

        _ignoreKeys: function(keyCode) {
            var IGNORING_KEYS = [
                40, // ARROW_DOWN
                38, // ARROW_UP
                13, // Enter
            ];

            return IGNORING_KEYS.indexOf(keyCode) != -1;
        },

        _updateSuggest: function(event) {
            var that = this;

            this._updateValues();

            var skills =  this.skills.split(this.const.DELIMITER).map(function(item) {
                return $.trim(item);
            });

            var lastSkill = _.last(skills);

            if (!this._ignoreKeys(event.keyCode)) {
                $.getJSON(this.suggestUrl + lastSkill).success(function(data) {
                    if (!data) {
                        return;
                    }

                    var suggestData = data.items.map(function(item) {
                        return item.text;
                    });

                    that.suggest.setData(suggestData, true);
                });
            }

            this.suggest.update(lastSkill, this.width);

            this.suggest.processKey(event);
        },

        _initializeSuggest: function() {
            this.suggest = new Suggest();
            this.listenTo(this.suggest, 'selectSuggest', this.onSelectSuggest);
        },

        _preventKeydown: function(event) {
            this.suggest.preventKeydown(event);
        },

        _onFocusOut: function(event) {
            this.suggest.hide();
        }
    });
});
