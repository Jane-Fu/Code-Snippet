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
        //$(ejs.render(_tipsTpl, this.option)).appendTo('body');
        $($.tpl(_tipsTpl, this.option)).appendTo('body');
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
            //$("body").removeClass("modal-open");
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