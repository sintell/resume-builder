define([
    'jquery',
    'underscore',
    'backbone',
    'collections/resumeList',
    'views/resumeListItem',
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
