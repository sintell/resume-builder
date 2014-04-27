define([
    'jquery',
    'underscore',
    'backbone',
    'views/suggest',
    'views/tags',
    'config',
    'utils',
    'text!templates/skillSet.html'
], function($, _, Backbone, Suggest, Tags, Config, Utils, SkillSetTemplate) {
    'use strict';

    return Backbone.View.extend({
        className: 'HH-ResumeSection-Component-SkillSetTemplate',

        componentName: 'skill-set',

        template: _.template(SkillSetTemplate),

        const: {
           DELIMITER: ','
        },

        suggestUrl: 'http://hh.ru/autosuggest/multiprefix/v2?d=key_skill&q=',

        events: {
            'keyup .HH-SkillSet-Input': '_updateSuggest',
            'keydown .HH-SkillSet-Input': '_preventKeydown',
            'focusout .HH-SkillSet-Input': '_onFocusOut',
            'click .HH-SkillSet-AddSkills': '_addTags'
        },

        initialize: function() {
            this._initializeSuggest();
            this.tags = new Tags();
        },

        fill: function(attributes) {
            var that = this;
            if (attributes.skill_set) {

                attributes.skill_set.forEach(function(item) {
                    that.tags.addTag(item, null, true);
                });

                this.skills = attributes.skill_set.join(this.const.DELIMITER + ' ');
            }
        },

        render: function() {
            var data = {
                skills: this.skills
            };

            this.$el.html(this.template(data));

            this.suggest.setElement(this.$('.HH-ResumeBuilder-Component-Suggest'));
            this.tags.setElement(this.$('.HH-ResumeBuilder-Component-Tags'));

            this.tags.render();

            this.$input = this.$('.HH-SkillSet-Input');

            return this;
        },

        takeback: function(attributes) {
            attributes.skill_set = this.tags.takeback().map(function(item) {
                return item.text;
            });
        },

        onSelectSuggest: function(data) {
            this._updateValues();

            if (this.skills.indexOf(this.const.DELIMITER) > 0) {
                var skills = this._getSplittedSkills();

                if (skills.length) {
                    skills[skills.length - 1] = data.text;
                }

                this.$input.val(skills.join(this.const.DELIMITER + ' '));
            } else {
                this.$input.val('');
                this.tags.addTag(data.text);
            }

            this.suggest.hide();
            this.$input.focus();
        },

        _addTags: function() {
            var that = this;

            this._updateValues();

            this._getSplittedSkills()
                .forEach(function(item) {
                    if (item) {
                        that.tags.addTag(item, null, false);
                    }
                });

            this.$input.val('');
            this.tags.render();
        },

        _updateValues: function() {
            this.skills = this.$input.val();
            this.width = this.$input.outerWidth();
        },

        _updateSuggest: function(event) {
            var that = this;

            this._updateValues();

            if (
                event.keyCode === Utils.keycodes.ENTER &&
                this.suggest.getSelected() === null
            ) {
                this._addTags();
                this.suggest.hide();
                return;
            }

            var skills = this._getSplittedSkills();

            var lastSkill = skills[skills.length - 1];

            if (!Utils.isIgnoringSuggestKeys(event.keyCode)) {
                $.ajax({
                    url: this.suggestUrl + lastSkill,
                    dataType: 'jsonp',
                    jsonp: 'p'
                }).success(function(data) {
                    if (!data) {
                        return;
                    }

                    var suggestData = data.items.map(function(item) {
                        return item.text;
                    });

                    that.suggest.setData(suggestData, true);
                });
            }

            this.suggest.update(lastSkill, this.width, true);

            this.suggest.processKey(event);
        },

        _initializeSuggest: function() {
            this.suggest = new Suggest();
            this.listenTo(this.suggest, 'selectSuggest', this.onSelectSuggest);
        },

        _preventKeydown: function(event) {
            this.suggest.preventKeydown(event);
        },

        _getSplittedSkills: function() {
            return this.skills
                .split(this.const.DELIMITER)
                .map(function(item) {
                    return item.trim();
                });
        },

        _onFocusOut: function(event) {
            this.suggest.hide();
        }
    });
});
