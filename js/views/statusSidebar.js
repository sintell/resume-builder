define([
    'underscore',
    'backbone',
    'config',
    'utils',
    'text!templates/statusSidebar.html',
    'text!templates/suggestedFields.html'
], function(
    _,
    Backbone,
    Config,
    Utils,
    SideBarTemplate,
    SuggestedFieldsTemplate
) {
    'use strict';

    var documentObject = $(document);

    return Backbone.View.extend({
        template: _.template(SideBarTemplate),
        suggestedFieldsTemplate: _.template(SuggestedFieldsTemplate),

        events: {
            'click .HH-SuggestedField': 'toggleEdit'
        },

        initialize: function(options) {
            this.model = options.model;

            this.fieldsNameMap = {
                'specialization': 'специализация',
                'language': 'язык',
                'title': 'название',
                'skills': 'профессиональная область',
                'experience': 'опыт',
                'contact': 'контактная информация',
                'skill_set': 'навыки',
                'education': 'образование',
                'salary': 'желаемая зарплата',
                'metro': 'ближайшее метро',
                'site': 'веб-сайт',
                'recommendation': 'рекомендации'
            };

            this.listenTo(this.model, 'load', this.render);
            this.listenTo(this.model, 'saveEnd', this.render);

            _.bindAll(this, 'switchFloat', 'setProgressBar');
        },

        render: function() {

            this.$el.html(this.template(this.model.attributes));

            this.$statusBlock = $('.HH-Sidebar-Status');

            this.$statusBlock.html(this.el);

            this.$infoSidebar = $('.HH-Sidebar-Info');
            
            this.$suggestedFields = $('.HH-Sidebar-SuggestedFields');
            
            this.setProgressBar(this.model.get('_progress').percentage);
            
            if (typeof this.positionFromTop === 'undefined') {            
                this.positionFromTop = this.$statusBlock.position().top;
            }

            this.$suggestedFields.html(this.suggestedFieldsTemplate({
                suggestedFields: this.getSuggestedFields()
            }));

            if (!Utils.isIOS()) {
                $(window).scroll(this.switchFloat);
            }
        },

        switchFloat: function() {
            if (!Utils.isIOS() && documentObject.scrollTop() < this.positionFromTop) {
                this.$statusBlock.removeClass('sidebar-section_fixed');

                this.$infoSidebar.css({
                    'paddingTop': 0
                });

            } else {
                this.$statusBlock.addClass('sidebar-section_fixed');
                var offset = this.$statusBlock.height();
                this.$infoSidebar.css({
                    'paddingTop': offset
                });
            }
        },

        setProgressBar: function(progressPercent) {
            this.$statusBlock.find('.HH-Sidebar-ProgressBar').width(progressPercent + '%');
            this.$statusBlock.find('.HH-Sidebar-ProgressText').text(progressPercent + '%');
        },

        getSuggestedFields: function() {
            var that = this;
            var mandatory = this.model.get('_progress').mandatory;
            var recommended = this.model.get('_progress').recommended;
            var fields;

            if (mandatory.length > 0) {
                fields = mandatory;
            } else if (recommended.length > 0) {
                fields = recommended;
            }

            return fields.map(function(fieldName) {
                return {id: fieldName, name: that.fieldsNameMap[fieldName]};
            }).sort(function(a,b) {
                return (a.name > b.name)? 1 : -1;
            });
        },

        toggleEdit: function(event) {
            this.model.trigger('editMode', {
                field: $(event.currentTarget).data('hh-field-name')
            });
        }
    });
});
