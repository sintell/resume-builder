define([
    'jquery',
    'underscore',
    'backbone',
    'models/resumeList'
    'text!templates/resumeList.html',
], function(
    $,
    _,
    Backbone,
    ResumeList,
    ResumeListTemplate
) {

    return Backbone.View.extend({
        template: _.template(ResumeListTemplate),

        initialize: function() {

        },
        render: function() {

        }
    });
    

});
