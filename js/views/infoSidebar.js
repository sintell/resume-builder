define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/infoSidebar.html'
], function(
    $,
    _,
    Backbone,
    InfoSidebarTemplate
) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(InfoSidebarTemplate),

        events: {
            'click .HH-Sidebar-ButtonUpdate': '_update',
            'click .HH-Sidebar-ButtonClone': '_clone',
            'click .HH-Sidebar-ButtonDestroy': '_destroy'
        },

        initialize: function(options) {
            this.listenTo(this.model, 'load', this.render);
            this.listenTo(this.model, 'sync', this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model.data()));

            $('.HH-Sidebar-Info').append(this.$el);

            return this;
        },

        _update: function() {
            // TODO сначала реализовать публикацию резюме
        },

        _clone: function() {
            // TODO реализовать после мержа HH-55 и HH-53
        },

        _destroy: function() {
            if (confirm('Вы уверены, что хотите удалить это резюме?')) {
                this.model.destroy({
                    wait: true,

                    success: function() {
                        window.location = '/';
                    }
                });
            }
        }
    });
});
