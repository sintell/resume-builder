define([
    'jquery',
    'underscore',
    'backbone',
    'config',
    'utils',
    'text!templates/infoSidebar.html'
], function(
    $,
    _,
    Backbone,
    Config,
    Utils,
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
            var data = $.extend({}, this.model.data(), {
                updated: this.updated,
                updated_at: Utils.formatUpdateTime(this.model.get('updated_at'))
            });

            this.$el.html(this.template(data));

            $('.HH-Sidebar-Info').html(this.$el);

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
            this.model.clone();
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
