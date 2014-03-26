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
        className: 'resume-list',

        initialize: function() {
            this.collection.on('load', this.render, this)
            this.collection.on('sync', this.render, this)
            this.collection.on('reset', this.render, this)
        },

        render: function() {
            this.collection.each(function(resumeListItem){
                var resumeListItemView = new ResumeListItemView({ 
                    model: resumeListItem
                });

                this.$el.html(resumeListItemView.render().el);
            }, this);

            return this;
        }
    });
});
