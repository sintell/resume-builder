define([
    'jquery',
    'underscore',
    'backbone',
    'collections/resumeList',
    'views/resumeListItem',
    'text!templates/resumeList.html',
], function(
    $,
    _,
    Backbone,
    ResumeList,
    ResumeListItemView,
    ResumeListTemplate
) {

    return Backbone.View.extend({
        tagName: 'ul',

        template: _.template(ResumeListTemplate),

        initialize: function() {

        },
        render: function() {
            this.collection.each(function(resumeListItem){
                var resumeListItemView = new ResumeListItemView({ 
                    model: resumeListItem
                });

                this.$el.append(resumeListItemView.render().el);
            }, this);
            return this;
        }
    });
    

});
