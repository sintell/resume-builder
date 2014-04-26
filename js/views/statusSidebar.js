define([
    'underscore',
    'backbone',
    'config',
    'utils',
    'text!templates/statusSidebar.html',
    'text!templates/suggestedFields.html',
    'text!templates/moderationNotes.html'
], function(
    _,
    Backbone,
    Config,
    Utils,
    SideBarTemplate,
    SuggestedFieldsTemplate,
    ModerationNotesTemplate
) {
    'use strict';

    var documentObject = $(document);

    return Backbone.View.extend({
        template: _.template(SideBarTemplate),
        suggestedFieldsTemplate: _.template(SuggestedFieldsTemplate),
        moderationNotesTemplate: _.template(ModerationNotesTemplate),

        events: {
            'click .HH-Sidebar-ButtonPublish': '_publish'
        },

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

            this.moderationNameMap = {
                'no_recommendation': 'recommendation',
                'block_no_education_place_or_date': 'education',
                'lot_information': '',
                'no_company_name': 'experience',
                'no_position': 'experience',
                'no_date': 'experience',
                'bad_education_student': 'education',
                'no_company_description': 'experience',
                'block_work_place': 'experience',
                'bad': 'skills',
                'block_no_function': 'experience',
                'bad_description': 'title',
                'not_enough_information': 'language',
                'bad_function': 'skills',
                'block_full_name': 'last_name',
                'bad_education': 'education'
            };

            this.listenTo(this.model, 'load', this.render);
            this.listenTo(this.model, 'saveEnd', this.render);

            _.bindAll(this, 'switchFloat', 'setProgressBar', 'toggleEdit');
        },

        render: function() {
            var fieldsData = this.getSuggestedFields();
            var moderationData = this.getModerationNotes();

            var drawModerationNotes = false;
            var drawRecommendedFields = false;

            if (typeof fieldsData !== 'undefined') {
                drawRecommendedFields = true;
            }

            if (typeof moderationData !== 'undefined') {
                drawModerationNotes = true;
            }

            var data = _.extend(this.model.attributes, {
                drawModerationNotes: drawModerationNotes,
                drawRecommendedFields: drawRecommendedFields
            });

            data = _.extend(data, this.model.data())

            this.$el.html(this.template(data));

            this.$statusBlock = $('.HH-Sidebar-Status');

            this.$statusBlock.html(this.el);

            this.$infoSidebar = $('.HH-Sidebar-Info');
            
            this.$suggestedFields = $('.HH-Sidebar-SuggestedFields');
            this.$moderationNotes = $('.HH-Sidebar-ModerationNotes');
            
            this.setProgressBar(this.model.get('_progress').percentage);
            
            if (typeof this.positionFromTop === 'undefined') {            
                this.positionFromTop = this.$statusBlock.position().top;
            }

            if (typeof fieldsData !== 'undefined') {
                this.$suggestedFields.html(this.suggestedFieldsTemplate({
                    suggestedFields: fieldsData
                }));       
                $('.HH-SuggestedField').click(this.toggleEdit);         
            }
            if (typeof moderationData !== 'undefined') {
                this.$moderationNotes.html(this.moderationNotesTemplate({
                    moderationNotes: moderationData
                }));       
                $('.HH-ModerationNote').click(this.toggleEdit);         
            }
 
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
            } else if (typeof recommended !== 'undefined' && recommended.length > 0) {
                fields = recommended;
            }

            if (typeof fields === 'undefined') {
                if (this.model.isNew()) {
                    return [{
                        id: 'last_name',
                        name: 'Начните заполнять резюме, чтобы получить рекомендации'
                    }];
                }
                return;
            }

            return fields.map(function(fieldName) {
                return {id: fieldName, name: that.fieldsNameMap[fieldName]};
            });
        },

        getModerationNotes: function() {
            var moderationNotes = this.model.get('moderation_note');
            var that = this;

            if (this.model.has('status') && this.model.get('status').id === 'blocked') {
                return moderationNotes.map(function(moderationNote) {
                    return {
                        id: that.moderationNameMap[moderationNote.id],
                        name: moderationNote.name
                    };
                });
            } else {
                return;
            }
        },

        toggleEdit: function(event) {
            this.model.trigger('editMode', {
                field: $(event.currentTarget).data('hh-field-name')
            });
        },

        _publish: function() {
            var that = this;

            $.ajax({
                type: 'POST',

                url: [Config.apiUrl, 'resumes', this.model.id, 'publish'].join('/'),

                success: function(data, status, xhr) {
                    that.updated = true;
                    that.render();
                }
            });
        }
    });
});
