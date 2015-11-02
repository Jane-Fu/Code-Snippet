/*
 *  一些常用到的小插件
 *  直接copy并不能使用，需要自己修改
 */


/*
 * 模板渲染，不能防备xss。
 * 如果有xss防备需求，请使用ejs等具备该功能的模板引擎
 */
;(function($) {
    $.tpl = function(str, data) {
        var fn = function(data) {
            var i, variable = [],
                value = [];
            for (i in data) {
                variable.push(i);
                value.push(data[i]);
            }
            return (new Function(variable, fn.code))
                .apply(data, value); // new Function返回渲染结果HTML
        };

        fn.code = fn.code || "var $parts=[]; $parts.push('" + str
            .replace(/\\/g, '\\\\')
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/(^|%>)[^\t]*/g, function(str) {
                return str.replace(/'/g, "\\'");
            }) // 将模板中文本部分的单引号替换为\'
            .replace(/\t=(.*?)%>/g, "',$1,'") // 将模板中<%= %>的直接数据引用（无逻辑代码）与两侧的文本用'和,隔开，同时去掉了左标签产生的tab符
            .split("\t").join("');") // 将tab符（上面替换左标签产生）替换为'); 由于上一步已经把<%=产生的tab符去掉，因此这里实际替换的只有逻辑代码的左标签
            .split("%>").join("$parts.push('") // 把剩下的右标签%>（逻辑代码的）替换为"$parts.push('"
            + "'); return $parts.join('');"; // 最后得到的就是一段JS代码，保留模板中的逻辑，并依次把模板中的常量和变量压入$parts数组

        return data ? fn(data) : fn;
    };
})(jQuery);

// back to top
;(function($) {
    'use strict'
    $.fn.backTop = function() {
        var $backBtn = $(this),
            b = document.body,
            d = document.documentElement;

        $backBtn.css("display", "none");
        window.onscroll = show;
        $backBtn.click(function() {
            $backBtn.css("display", "none");
            window.onscroll = null;
            var setInt = setInterval(function() {
                b.scrollTop -= Math.ceil((b.scrollTop + d.scrollTop) * 0.1);
                d.scrollTop -= Math.ceil((b.scrollTop + d.scrollTop) * 0.1);
                if ((b.scrollTop + d.scrollTop) == 0) {
                    clearInterval(setInt, window.onscroll = show);
                }
            }, 10);
        });

        function show() {
            var scroll = b.scrollTop + d.scrollTop;
            if ( scroll > 100) {
                $backBtn.fadeIn(1000);
            } else {
                $backBtn.css("display", "none");
            }
        }
    };
})(jQuery);

// tooltips
;(function($) {
    var html = '<div class="toolTipWrap">' +
                    '<div class="toolTipTop"></div>' +
                    '<div class="toolTipMid">' +
                    '</div>' +
                    '<div class="toolTipBtm"></div>' +
                '</div>';
    $.fn.toolTip = function(){
        $(this).hover(
            function(event) {
                this.tip = this.title ? this.title : $(this).text();
                $dom = $(html);
                $dom.find(".toolTipMid").text(this.tip);
                event.stopPropagation();

                var mouseLeft = event.pageX,
                    mouseTop = event.pageY;
                //this.title = "";
                $dom.appendTo("body");
                this.height = $(this).height();
                $('.toolTipWrap').css({
                    left: mouseLeft + 20,
                    top: mouseTop + 20
                });
                $('.toolTipWrap').fadeIn(300);
            },
            function() {
                $('.toolTipWrap').fadeOut(300);
                $('.toolTipWrap').remove();
                //this.title = this.tip;
            }
        );
        $(this).mousemove(function(event) {
            var mouseLeft = event.pageX,
                mouseTop = event.pageY;

            $('.toolTipWrap').css({
                left: mouseLeft + 20,
                top: mouseTop + 20
            });
        });
    };
})(jQuery);

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
            $(ejs.render(_loadingTpl, this.option)).appendTo('body');
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

// dialog
;(function($) {
    var _dialogTpl = '<div class="modal-dialog A-plugin-dialog fade">' +
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
        this.element = $(ejs.render(_tpl, this.option)).appendTo('body');

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

// tips
;(function($) {
    var _tipsTpl = '<div class="alert alert-<%=type%> alert-dismissible fade A-plugin-tips wipos-tips-layout">' +
        '<button type="button" class="close"><span aria-hidden="true">×</span></button>' +
        '<%=content%>' +
        '</div>';

    var defaults = {
            content: '',
            stayTime: 3000,
            type: 'warning', // 提示类型，可选warning|danger
            callback: function() {}
        },
        position = function(dom, index) {
            if (index > 1) {
                var pre = alerts[index - 2];
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
    // 构造函数
    var Tips = function(option) {
        var self = this;
        this.option = typeof(option) == 'object' ? $.extend(defaults, option) : defaults;
        if ($('.A-plugin-tips').length) {
            $('.A-plugin-tips').remove();
        }
        if (typeof option == "string") {
            this.option.content = option;
        }
        $(ejs.render(_tipsTpl, this.option)).appendTo('body');
        this.element = $el = $('.A-plugin-tips');
        position($el);
        self.show();
        self.bindEvent();
    };
    Tips.prototype = {
        show: function() {
            var self = this;
            self.element.addClass("in");
            if (self.option.stayTime > 0) {
                setTimeout(function() {
                    self.hide();
                }, self.option.stayTime);
            }
        },
        hide: function() {
            var self = this;
            self.element.removeClass("in");
            setTimeout(function() {
                self.element.remove();
            }, 500);
            this.option.callback();
        },
        bindEvent: function() {
            var self = this;
            self.element.find(".close").click(function() {
                self.hide();
            });
        }
    };

    function Plugin(option) {
        return new Tips(option);
    }
    $.tips = Plugin;
})(jQuery);

// 模态框
;(function($) {
    // var testHtml = '<div class="modal modal-layout fade">' +
    //     '<div class="modal-dialog">' +
    //     '<div class="modal-content">' +
    //     '<div class="modal-header">' +
    //     '<button type="button" class="close"><span aria-hidden="true">&times;</span></button>' +
    //     '<h4 class="modal-title" id="myModalLabel">Modal title</h4>' +
    //     '</div>' +
    //     '<div class="modal-body">' +
    //     '<p>Overflowing text to show scroll behaviorCras mattis consectetur purus sit amet fermentum.Cras justo odio, dapibus ac facilisis in , egestas eget quam.Morbi leo risus, porta ac consectetur ac, vestibulum at eros.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.Aenean lacinia bibendum nulla sed consectetur.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Donec sed odio dui.Donec ullamcorper nulla non metus auctor fringilla.Cras mattis consectetur purus sit amet fermentum.Cras justo odio, dapibus ac facilisis in , egestas eget quam.Morbi leo risus, porta ac consectetur ac, vestibulum at eros.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.Aenean lacinia bibendum nulla sed consectetur.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Donec sed odio dui.Donec ullamcorper nulla non metus auctor fringilla.Cras mattis consectetur purus sit amet fermentum.Cras justo odio, dapibus ac facilisis in , egestas eget quam.Morbi leo risus, porta ac consectetur ac, vestibulum at eros.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.Aenean lacinia bibendum nulla sed consectetur.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Donec sed odio dui.Donec ullamcorper nulla non metus auctor fringilla.' +
    // '</p></div>' +
    // '<div class="modal-footer">' +
    // '<button type="button" class="btn btn-default J-canlce">Close</button>' +
    // '<button type="button" class="btn btn-primary">Save changes</button>' +
    // '</div>' +
    // '</div>' +
    // '</div>' +
    // '</div>';

    var Modal = function(tpl, callback) {
            this.template = tpl;
            this.data = null;
            this.callback = callback;
        },
        position = function(dom, index) {
            if (index > 1) {
                var pre = alerts[index - 2];
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
                    top: (bodyHeight / 2 - height / 2) / 3,
                    left: bodyWidth / 2 - width / 2
                });
            }

        };
    Modal.prototype = {
        create: function() {
            var self = this;

            self.element = $(self.template).appendTo("body");
            self.$this = self.element;
            position(self.element.find(".modal-dialog"));
        },
        show: function(_data) {
            var self = this;

            self.create();
            self._bindEvent();

            if (_data) {
                self.data = _data;
            }
            self.element.show();
            setTimeout(function() {
                self.element.addClass("in");
            }, 100);
            //$("body").addClass("modal-open");

            if (self.callback && typeof self.callback == "function") {
                self.callback();
            }
        },
        hide: function() {
            var self = this;
            self.element.removeClass("in");
            setTimeout(function() {
                self.element.remove();
            }, 200);
            $("body").removeClass("modal-open");
        },
        afterRender: function(fn) {
            var self = this;
            if (fn && typeof fn == "function") {
                fn(self);
            }
        },
        _bindEvent: function() {
            var self = this;
            self.element.find(".close").click(function() {
                self.hide();
            });
        }
    };
    $.fn.Wimodal = $.Wimodal = function(tpl, _callback) {
        var $this = this,
            argLength = arguments.length,
            template, callback;

        if (typeof $this == "object" && $this.html()) {
            template = $this.html();
        }

        if (argLength === 1 && typeof arguments[0] == "string") {
            template = arguments[0];
        } else if (argLength === 1 && typeof arguments[0] == "function") {
            callback = arguments[0];
        }

        if (tpl && _callback) {
            template = tpl;
            callback = _callback;
        }

        return new Modal(template, callback);
    };
    // demo
    // var modal = $.Wimodal(testHtml, function() {
    //     var self = this,
    //         $this = self.$this;
    //     $this.find(".J-canlce").click(function() {
    //         $.tips("确定关闭么？？？？");
    //     });
    // });
    // modal.show();
})(jQuery);

// switch
;(function() {
    $.fn.switchCheck = function() {
        var $this = $(this);
        var $label = $('<label class="switch-checkbox J-switch-checkbox off"></label>');
        if ($this.closest('.J-switch-checkbox').length) {
            return false;
        }
        $this
            .wrap($label)
            .before('<span class="switch-checkbox-text">开</span><span class="switch-checkbox-text">关</span><span class="switch-checkbox-btn"></span>');
        $label = $this.closest('.switch-checkbox');
        var _checked = $this.prop('checked');
        if (_checked) {
            $label.removeClass('off');
        }
        $this.change(function() {
            var _checked = $this.prop('checked');
            if (_checked) {
                $label.removeClass('off');
            } else {
                $label.addClass('off');
            }
        });
    };
})(jQuery);

// 日期联动
;(function($) {
    $.fn.dateSelect = function(year, month, day) {
        var $this = $(this);

        var nowDate = new Date(),
            nowYear = nowDate.getFullYear(),
            nowMonth = nowDate.getMonth() + 1,
            nowDay = nowDate.getDate();

        // 设置每个月份的天数
        var getDays = function(year, month) {
                var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                if (month == 1 && isLeapYear(year)) {
                    return 29;
                }
                return monthDays[month - 1];
            },
            // 判断是否闰年
            isLeapYear = function(year) {
                return (year % 4 == 0 || (year % 100 == 0 && year % 400 == 0));
            },
            getDayOption = function(days) {
                var dayStr = '';
                for (var i = 1; i <= days; i++) {
                    var day_val = i > 9 ? i : '0' + i;
                    dayStr += "<option value='" + day_val + "'> " + i + "日</option>";
                }
                return dayStr;
            };
        $this.each(function() {
            var $self = $(this),
                $year = year ? $self.find(year) : $self.find(".J-year"),
                $month = month ? $self.find(month) : $self.find(".J-month"),
                $days = day ? $self.find(day) : $self.find(".J-day"),
                yearStr = '',
                monthStr = '';

            // year option
            for (var i = (nowYear - 30); i < (nowYear + 30); i++) {
                yearStr += "<option value='" + i + "'> " + i + "年</option>";
            }

            if ($year.attr("data-value")) {
                $year.html(yearStr).val($year.attr("data-value"));
            } else {
                $year.html(yearStr).val(nowYear);
            }

            // month option
            for (var j = 1; j <= 12; j++) {
                var month_val = j > 9 ? j : '0' + j;
                monthStr += "<option value='" + month_val + "'> " + j + "月</option>";
            }
            if ($month.attr("data-value")) {
                $month.html(monthStr).val($month.attr("data-value"));
            } else {
                $month.html(monthStr).val(nowMonth);
            }

            // days option
            var monthDays = getDays(nowYear, nowMonth);
            if ($days.attr("data-value")) {
                $days.html(getDayOption(monthDays)).val($days.attr("data-value"));
            } else {
                $days.html(getDayOption(monthDays)).val(nowDay);
            }

            // 事件绑定
            $month.change(function() {
                var year = $year.val(),
                    month = $(this).val(),
                    days = getDays(year, month),
                    oldDate = $days.val();

                $days.html(getDayOption(days)).val(oldDate);
            });
        });
    };
})(jQuery);

// jquery file input image upload
// @param [number] {maxSize} 文件大小限制：
;(function($) {
    $.fn.imageUpload = function(url, $input, maxSize) {
        var csrftoken = getCookie('csrftoken') || '';
        $(this).each(function() {
            var name = 'imageUpload' + new Date().getTime();
            var html = '<form method="post" enctype="multipart/form-data" action="' + url + '" target="' + name + '"></form>';
            var $form = $(html);
            var $iframe = $('<iframe name="' + name + '" class="hide"></iframe>');
            var $this = $(this);
            $iframe.appendTo('body');
            $iframe.load(function() {
                var _html = $iframe.contents().find('pre').html();
                if (!$.trim(_html)) {
                    return false;
                }
                $.loading("hide");
                var data = JSON.parse(_html);
                if (data.status == "success") {
                    $.tips("上传成功");
                    $input.val(data.detail).attr("data-pre-url", data.preview_url).trigger('change');
                } else if (data.detail) {
                    $.tips(data.detail);
                }
            });
            $this.change(function() {
                if (!$this.val().length) {
                    return false;
                } else if (!/.+\.(?:png|jpg|jpeg|gif)$/i.test($this.val())) {
                    $.tips('请上传png、jpg、jpeg、gif格式文件');
                    return false;
                }
                if (maxSize) {
                    var fileSize,
                        isIE = /msie/i.test(navigator.userAgent) && !window.opera;

                    if (isIE && !$this.files) {
                        var filePath = $this.value,
                            fileSystem = new ActiveXObject("Scripting.FileSystemObject"),
                            file = fileSystem.GetFile(filePath);
                        fileSize = file.Size;
                    } else {
                        fileSize = $this[0].files[0].size;
                    }
                    // 转换为kb进行比较
                    if ((fileSize / 1024 * 1024) > (maxSize * 1024)) {
                        $.tips("文件过大，请压缩后上传");
                        return false;
                    }
                }
                $.loading({
                    content: "上传中..."
                });
                if (!$this.closest('form').length) {
                    $this.wrap($form);
                }
                if (csrftoken) {
                    $this.closest('form').prepend('<input type="hidden" value="' + csrftoken + '" name="csrfmiddlewaretoken">');
                }
                $this.closest('form').submit();
                // $form.empty().append($this.clone()).appendTo('body').submit();
            });
        });
    };
})(jQuery);

// double month calender
;(function($) {
    var fillZero = function(_num) {
        if (_num == undefined) {
            return null;
        }
        _num = _num + '';
        return _num.length == 1 ? "0" + _num : _num;
    };

    var isLeap = function(year) {
        if (!(year % 400) || !(year % 4) && (year % 100)) {
            return true;
        } else {
            return false;
        }
    };

    var daysNum = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var getMonthDay = function(year, month) {
        if (month == 1 && isLeap(year)) {
            return 29;
        } else {
            return daysNum[month];
        }
    };

    var getDay = function(dateStr) {
        if (dateStr) {
            return new Date(dateStr).getDay();
        } else {
            return new Date().getDay();
        }
    };

    var getArray = function(year, month) {
        var prev, prevMonth, prevYear;
        if (month > 0) {
            prev = getMonthDay(year, month - 1);
            prevMonth = month - 1;
            prevYear = year;
        } else {
            prev = getMonthDay(year - 1, 11);
            prevMonth = 11;
            prevYear = year - 1;
        }
        var nextMonth, nextYear;
        if (month < 11) {
            nextMonth = month + 1;
            nextYear = year;
        } else {
            nextMonth = 0;
            nextYear = year + 1;
        }
        var firstDay = getDay(year + '/' + (month + 1) + '/' + 1);
        var monthDay = getMonthDay(year, month);
        var _array = [];
        for (var i = 1; i <= monthDay; i++) {
            _array.push({
                year: year,
                month: month,
                date: i
            });
        }
        for (var i = 1; i <= (42 - monthDay - firstDay); i++) {
            _array.push({
                year: nextYear,
                month: nextMonth,
                date: i
            });
        }
        for (var i = 0; i < firstDay; i++) {
            _array.unshift({
                year: prevYear,
                month: prevMonth,
                date: prev - i
            });
        }
        return _array;
    };

    var calenderOuter = [
        '<div class="calender-layout hide">',
        '<div class="calender-header strong tc clearfix "><a href="javascript:void(0);" class="arrow l J-prev-month">&lt;</a><p class="l calender-header-date mid-line"><span class="year"></span> 年<span class="month"></span> 月</p>',
        '<a href="javascript:void(0);" class="arrow lb r J-next-month">&gt;</a><p class="calender-header-date r"><span class="year-next"></span> 年<span class="month-next"></span> 月</p></div>',
        '<table class="calender-date">',
        '<tr><td class="vt mid-line"><div class="calender-content J-calender-cur"></div></td><td class="vt"><div class="calender-content J-calender-next"></div></td></tr>',
        '<tr><td colspan="2"><a href="javascript:void(0);" class="calender-btn calender-sure J-calender-sure">确定</a></td></tr>',
        '</table></div>'
    ].join('');

    var tableHeader = '<table><tr class="calender-week-day"><th><div>日</div></th><th><div>一</div></th><th><div>二</div></th><th><div>三</div></th><th><div>四</div></th><th><div>五</div></th><th><div>六</div></th></tr>';

    function Calender(time, parent) {
        var date, today;
        if (time) {
            date = new Date(time);
        } else {
            date = new Date();
        }
        today = new Date();
        this.today = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        this.year = date.getFullYear();
        this.month = date.getMonth();
        this.date = date.getDate();
        if (this.month < 11) {
            this.monthNext = this.month + 1;
            this.yearNext = this.year;
        } else {
            this.monthNext = 0;
            this.yearNext = this.year + 1;
        }

        if (parent) {
            this.parent = parent;
        }
        this.monthArr = getArray(this.year, this.month);
        this.nextArr = getArray(this.yearNext, this.monthNext);
    }

    Calender.prototype.set = function(time) {
        Calender.call(this, time);
    };
    Calender.prototype.prevMonth = function() {
        var month = this.month;
        if (month > 0) {
            this.month = month - 1;
        } else {
            this.month = 11;
            this.year = this.year - 1;
        }
        this.date = 1;
        var time = this.year + '/' + (this.month + 1) + '/' + this.date;
        Calender.call(this, time);
        return this;
    };

    Calender.prototype.nextMonth = function() {
        var month = this.month;
        if (month < 11) {
            this.month = month + 1;
        } else {
            this.month = 0;
            this.year = this.year + 1;
        }
        this.date = 1;
        var time = this.year + '/' + (this.month + 1) + '/' + this.date;
        Calender.call(this, time);
        return this;
    };

    Calender.prototype.prevYear = function() {
        this.year--;
        this.date = 1;
        var time = this.year + '/' + (this.month + 1) + '/' + this.date;
        Calender.call(this, time);
        return this;
    };

    Calender.prototype.nextYear = function() {
        this.year++;
        this.date = 1;
        var time = this.year + '/' + (this.month + 1) + '/' + this.date;
        Calender.call(this, time);
        return this;
    };

    Calender.prototype.render = function($dom) {
        var monthArr = this.monthArr,
            nextArr = this.nextArr,
            month = this.month,
            next = this.monthNext,
            html = tableHeader,
            htmlNext = tableHeader,
            today = new Date(),
            todayYear = today.getFullYear(),
            todayMonth = today.getMonth(),
            todayDate = today.getDate();

        for (var i = 0, len = monthArr.length; i <= len; i++) {
            if (i % 7 == 0 && i == 0) {
                html += '<tr>';
            } else if (i % 7 == 0 && monthArr[i]) {
                html += '</tr><tr>';
            } else if (i % 7 == 0 && !monthArr[i]) {
                html += '</tr>';
            }
            if (monthArr[i]) {
                if (monthArr[i].month != month) {
                    html += '<td></td>';
                } else {
                    html += '<td class="J-date-pick data-pick calender-curmon';
                    if ((i % 7 == 0) || (i % 7 == 6)) {
                        html += ' week';
                    }
                    // if( i % 7 == 6 ) {
                    //     html += ' calender-brn';
                    // }
                    if (monthArr[i].year > todayYear) {
                        html += ' not-on'
                    } else if (monthArr[i].year == todayYear && monthArr[i].month > todayMonth) {
                        html += ' not-on';
                    } else if (monthArr[i].year == todayYear && monthArr[i].month == todayMonth && monthArr[i].date > todayDate) {
                        html += ' not-on';
                    }
                    html += '" data-date="' + monthArr[i].year + '/' + (monthArr[i].month + 1) + '/' + monthArr[i].date + '" ><div>' + monthArr[i].date + '</div></td>';
                }
            }
        }
        for (var i = 0, len = nextArr.length; i <= len; i++) {
            if (i % 7 == 0 && i == 0) {
                htmlNext += '<tr>';
            } else if (i % 7 == 0 && nextArr[i]) {
                htmlNext += '</tr><tr>';
            } else if (i % 7 == 0 && !nextArr[i]) {
                htmlNext += '</tr>';
            }
            if (nextArr[i]) {
                if (nextArr[i].month != next) {
                    htmlNext += '<td></td>';
                } else {
                    htmlNext += '<td class="J-date-pick data-pick calender-curmon';
                    if (nextArr[i].year > todayYear) {
                        htmlNext += ' not-on'
                    } else if (nextArr[i].year == todayYear && nextArr[i].month > todayMonth) {
                        htmlNext += ' not-on';
                    } else if (nextArr[i].year == todayYear && nextArr[i].month == todayMonth && nextArr[i].date > todayDate) {
                        htmlNext += ' not-on';
                    }
                    htmlNext += '" data-date="' + nextArr[i].year + '/' + (nextArr[i].month + 1) + '/' + nextArr[i].date + '" ><div>' + nextArr[i].date + '</div></td>';
                }
            }
        }
        this.parent.find('.year').html(this.year);
        this.parent.find('.year-next').html(this.yearNext);
        this.parent.find('.month').html(this.month + 1);
        this.parent.find('.month-next').html(this.monthNext + 1);
        this.parent.find('.J-calender-cur').html(html);
        this.parent.find('.J-calender-next').html(htmlNext);
        this.parent.appendTo('body');
        var top = $dom.offset().top + $dom.outerHeight(),
            left = $dom.offset().left;
        this.parent.css({
            position: 'absolute',
            top: top,
            left: left
        }).removeClass('hide');
    };

    var calenderInit = function() {
        var $this = $(this),
            $calender = $(calenderOuter),
            _val = $this.val();

        var calender = new Calender(_val, $calender);

        $calender.click(function(e) {
            e.stopPropagation();
        });
        $calender.on('click', '.J-next-month', function() {
            calender.nextMonth().render($this);
        });
        $calender.on('click', '.J-prev-month', function() {
            calender.prevMonth().render($this);
        });
        $calender.on('click', '.J-date-pick', function() {
            if ($(this).hasClass("not-on")) {
                return false;
            }
            var $picks = $calender.find('.J-date-pick');
            var $self = $(this);
            var exist = $calender.find('.J-date-pick.on').length;
            if (exist == 0 || exist >= 2) {
                $picks.removeClass('on radius');
                $self.addClass('on radius');
            } else {
                var onIndex = $picks.index($calender.find('.J-date-pick.on'));
                var thisIndex = $picks.index(this);
                var big = onIndex > thisIndex ? onIndex : thisIndex;
                var small = onIndex > thisIndex ? thisIndex : onIndex;
                $picks.each(function(i) {
                    if (i <= big && i >= small) {
                        $(this).addClass('on');
                        if (i == big || i == small) {
                            $(this).addClass('radius');
                        }
                    }
                });
            }
        });
        $calender.on('click', '.J-calender-sure', function() {
            var $ons = $calender.find('.J-date-pick.on');
            if ($ons.length == 0) {
                return false;
            }
            if ($ons.length == 1) {
                $this.find(".J-date-val").val($ons.attr('data-date')).trigger('change');
                $this.find(".J-calender-text").text($ons.attr('data-date'));
                $calender.addClass('hide');
                return false;
            }
            $this.find(".J-date-val").val($ons.first().attr('data-date') + '-' + $ons.last().attr('data-date')).trigger('change');
            $this.find(".J-calender-text").text($ons.first().attr('data-date') + '-' + $ons.last().attr('data-date'));
            $calender.addClass('hide');
            return false;
        });
        $('body').click(function() {
            $calender.addClass('hide');
        });
        // $this.focus(function(){
        //     if ($this.val()) {
        //         var dateNow = $this.val().match(/^[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}/)[0];
        //         calender.set(dateNow);
        //     }
        //     calender.render($this);
        // }).click(function(e){
        //     e.stopPropagation();
        // });
        $this.click(function(e) {
            if ($this.val()) {
                var dateNow = $this.val().match(/^[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}/)[0];
                calender.set(dateNow);
            }
            calender.render($this);
            e.stopPropagation();
        });
    };

    $.fn.doubleMonth = function() {
        $(this).each(calenderInit);
    };

})(jQuery);
