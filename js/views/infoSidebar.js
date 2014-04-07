define([
    'jquery',
    'underscore',
    'backbone',
    'config',
    'text!templates/infoSidebar.html'
], function(
    $,
    _,
    Backbone,
    Config,
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
            this.updated = false;
            this.listenTo(this.model, 'load', this.render);
            this.listenTo(this.model, 'sync', this.render);
        },

        render: function() {
            this.$el.html(this.template($.extend(this.model.data(), {updated: this.updated})));

            $('.HH-Sidebar-Info').append(this.$el);
            this.updated = false;

            return this;
        },

        _update: function() {
            var that = this;

            $.ajax({
                type: 'POST',

                url: [Config.apiUrl, 'resumes', this.model.id, 'publish'].join('/'),

                success: function(data, status, xhr) {
                    that.updated = true;
                    that.render();
                }
            });
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
