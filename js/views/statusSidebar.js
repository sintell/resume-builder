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

        initialize: function(options) {
            this.model = options.model;

            this.fieldsNameMap = {
                'specialization': 'профессиональная область',
                'language': 'владение языками',
                'title': 'название',
                'skills': 'личные качества',
                'experience': 'опыт работы',
                'contact': 'контактная информация',
                'skill_set': 'навыки',
                'education': 'образование',
                'salary': 'желаемая зарплата',
                'metro': 'ближайшее метро',
                'site': 'веб-сайт',
                'recommendation': 'рекомендации',
                'birth_date': 'дата рождения',
                'last_name': 'фамилия',
                'first_name': 'имя',
                'middle_name': 'отчество',
                'citizenship': 'гражданство',
                'area': 'город проживания',
                'gender': 'пол'
            };

            this.listenTo(this.model, 'load', this.render);
            this.listenTo(this.model, 'saveEnd', this.render);

            _.bindAll(this, 'switchFloat', 'setProgressBar', 'toggleEdit');
        },

        render: function() {
            var fieldsData = this.getSuggestedFields();
            var data = this.model.attributes;

            if (typeof fieldsData === 'undefined') {
                data = _.extend(data, {
                    drawRecommendedFields: false
                });
            } else {
                data = _.extend(data, {
                    drawRecommendedFields: true
                });                
            }

            this.$el.html(this.template(data));

            this.$statusBlock = $('.HH-Sidebar-Status');

            this.$statusBlock.html(this.el);

            this.$infoSidebar = $('.HH-Sidebar-Info');
            
            this.$suggestedFields = $('.HH-Sidebar-SuggestedFields');
            
            this.setProgressBar(this.model.get('_progress').percentage);
            
            if (typeof this.positionFromTop === 'undefined') {            
                this.positionFromTop = this.$statusBlock.position().top;
            }

            if (typeof fieldsData !== 'undefined') {
                this.$suggestedFields.html(this.suggestedFieldsTemplate({
                    suggestedFields: fieldsData
                }));       
                $('.HH-SuggestedField').click(this.toggleEdit);         
            };
 
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

            if (typeof mandatory !== 'undefined' && mandatory.length > 0) {
                fields = mandatory;
            } else if (typeof recomended !== 'undefined' && recommended.length > 0) {
                fields = recommended;
            }

            if (typeof fields === 'undefined') {
                if (this.model.isNew()) {
                    return [{
                        id: 'last_name',
                        name: 'Начните заполнять резюме, что бы получить рекомендации'
                    }]
                } else {
                    return;
                }
            }

            return fields.map(function(fieldName) {
                return {id: fieldName, name: that.fieldsNameMap[fieldName]};
            });
        },

        toggleEdit: function(event) {
            this.model.trigger('editMode', {
                field: $(event.currentTarget).data('hh-field-name')
            });
        }
    });
});
