define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/resumeListItem.html',
], function(
    $,
    _,
    Backbone,
    ResumeListItemTemplate
) {

    return Backbone.View.extend({
        tagName: 'li',
        className: 'HH-Resume-ResumeListItem',

        template: _.template(ResumeListItemTemplate),

        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this
        }
    });
    

});
