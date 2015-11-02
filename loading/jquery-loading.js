// loading
;(function($) {
    var _loadingTpl = '<div class="loading-layout J-plugin-loading hide"><div class="loading-bg"></div><div class="loading J-loading-text"><%= content %></div></div>';

    var defaults = {
        content: '加载中...'
    };
    // 构造函数
    var Loading = function(option) {
        var self = this;
        this.option = typeof(option) == 'object' ? $.extend(defaults, option) : defaults;
        if ($('.J-plugin-loading').length == 0) {
            //$(ejs.render(_loadingTpl, this.option)).appendTo('body');
            $($.tpl(_loadingTpl, this.option)).appendTo('body');
        } else {
            $('.J-plugin-loading .J-loading-text').text(this.option.content);
        }

        this.element = $('.J-plugin-loading');
        if (typeof(option) == 'string') {
            this[option]();
            return;
        }
        this.show();
    };
    Loading.prototype = {
        show: function() {
            this.element.removeClass('hide');
        },
        hide: function() {
            this.element.addClass('hide');
        }
    };

    function Plugin(option) {
        return new Loading(option);
    }
    $.loading = Plugin;
})(jQuery);