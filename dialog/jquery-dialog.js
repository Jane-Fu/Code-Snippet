// dialog
;(function($) {
    var _dialogTpl = '<div class="modal-dialog fade">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-role="dismis"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>' +
        '<h4><%=title%></h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<p><%= content %></p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<% for (var key in button) { %>' +
        '<% if (key == select) { %>' +
        '<button type="button" data-role="<%=key%>"  class="btn btn-default btn-primary"><%=button[key]%></button>' +
        '<% } else { %>' +
        '<button type="button" class="btn btn-default" data-role="<%=key%>"><%=button[key]%></button>' +
        '<% } %>' +
        '<% } %>' +
        '</div>' +
        '</div>' +
        '</div>';
    var defaults = {
            title: '',
            content: '',
            button: {
                action: '确认',
                dismis: '取消'
            },
            select: 'action',
            allowScroll: false,
            dismis: function() {},
            action: function() {}
        },
        dialog = [],
        removeDialog = function(obj) {
            for (var i = 0, _len = dialog.length; i < _len; i++) {
                if (dialog[i] == obj) {
                    dialog.splice(i, 1);
                }
            }
        },
        position = function(dom, index) {
            if (index > 1) {
                var pre = dialog[index - 2];
                dom.css({
                    top: pre.element.offset().top + 20,
                    left: pre.element.offset().left + 20
                });
            } else {
                var width = dom.outerWidth(),
                    height = dom.outerHeight(),
                    $window = $(window),
                    bodyWidth = $window.width(),
                    bodyHeight = $window.height(),
                    scrollTop = $window.scrollTop();
                dom.css({
                    top: (bodyHeight / 2 - height / 2) / 3 * 2 + scrollTop,
                    left: bodyWidth / 2 - width / 2
                });
            }

        };
    var Dialog = function(_tpl, option) {
        this.option = option && typeof(option) == 'object' ? $.extend(defaults, option) : defaults;
        if (typeof(option) == 'string') {
            this[option]();
            return;
        }
        this.index = dialog.push(this);
        //this.element = $(ejs.render(_tpl, this.option)).appendTo('body');
        this.element = $($.tpl(_tpl, this.option)).appendTo('body');
        if (this.element.find('[data-role]').length) {
            this.button = this.element.find('[data-role]');
        }
        this._bindEvent();
        this.bindMove();
        this.toggle();
        position(this.element, this.index);
    };
    Dialog.prototype = {
        _bindEvent: function() {
            var self = this;
            self.button.on("click", function() {
                self.toggle();
                var role = $(this).attr('data-role');
                self.option[role]();
            });
            self.element.find(".close").click(function() {
                self.hide();
            });
        },
        toggle: function() {
            if (this.element.hasClass("in")) {
                this.hide();
            } else {
                this.show();
            }
        },
        show: function() {
            var self = this;
            self.element.addClass("in");
        },
        hide: function() {
            var self = this;
            self.element.removeClass("in");
            removeDialog(self);
            setTimeout(function() {
                self.element.remove();
            }, 500);
        },
        mousemove: function(x, y) {
            var self = this;
            $('body').on('mousemove.' + self.moveingTag, function(e) {
                if (self.moving) {
                    self.element.css({
                        top: e.pageY - y,
                        left: e.pageX - x
                    }).addClass('on');
                }
            });
        },
        offMousemove: function(x, y) {
            var self = this;
            $('body').off('mousemove.' + self.moveingTag);
            self.element.removeClass('on');
        },
        bindMove: function() {
            var self = this;
            self.moveingTag = 'alertMoving' + (new Date().getTime());
            self.element.mousedown(function(e) {
                self.moving = true;
                self.mousemove(e.pageX - self.element.offset().left, e.pageY - self.element.offset().top);
            }).mouseup(function() {
                self.offMousemove();
            });

        }
    };

    function Plugin(option) {
        var $this = this;
        if (typeof $this == "object" && $this.html()) {
            return new Dialog($this.html(), option);
        }
        return new Dialog(_dialogTpl, option);
    }
    $.fn.dialog = $.dialog = Plugin;
})(jQuery)