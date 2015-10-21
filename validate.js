/*
 *  jQuery validVal version 0.1
 *  Male.Liang
 *
 */
;(function($) {
    function ValidVal(form, opts) {
        this.form = form;
        this.options = opts;
        this.validators = {};
        this.data = {};
        this.errorFlag = [];
        this._init();
        this.getData();
    }

    ValidVal.prototype = {
        // 添加验证规则
        addValidations: function( obj ) {
            var _defaultValidations = this.defaultValidations;

            for (var key in obj) {
                _defaultValidations[key] = obj[key];
            }

            return this;
        },
        // 验证
        validate : function( opts ) {
            var self = this;

            self.getData();

            var _validateRules = self.defaultValidations,
                _data = self.data;
            if ( !opts ) {
                self.errorFlag = [];
                this.form.find("[data-vali]").each(function() {
                    var _val = $(this).val(),
                        _key = $(this).attr("data-vali");
                    if (_key && !_validateRules[_key]( _val )) {
                        // if (this.options.error && typeof this.options.error === 'function') {
                        //     this.options.error();
                        // }
                        $(this).closest(".wipos-input")
                            .addClass("has-error")
                            .removeClass("has-success");

                        self.errorFlag.push(false);
                    }  else {
                        $(this).closest(".wipos-input")
                            .addClass("has-success")
                            .removeClass("has-error");

                        self.errorFlag.push(true);
                    }
                });
            } else if ($.type( opts ) === 'array') {
                self.errorFlag = [];
                for (var i = 0; i < opts.length; i++ ) {
                    var _key = opts[i],
                        validator = this.form.find("[name="+ _key + "]").length ? this.form.find("[name="+ _key + "]") : this.form.find("[data-vali="+ _key + "]");

                    validator.each(function() {
                        var _val = $(this).val(),
                            valiRul = $(this).attr("data-vali");
                       if (valiRul && !_validateRules[valiRul]( _val )) {
                            // if (this.options.error && typeof this.options.error === 'function') {
                            //     this.options.error();
                            // }
                            $(this).closest(".wipos-input")
                                .addClass("has-error")
                                .removeClass("has-success");

                            self.errorFlag.push(false);
                        }  else {
                            $(this).closest(".wipos-input")
                                .addClass("has-success")
                                .removeClass("has-error");

                            self.errorFlag.push(true);
                        }
                    });
                }
            } else if($.type(opts) === 'string') {
                var validator = this.form.find("[name="+ opts + "]").length ? this.form.find("[name="+ opts + "]") : this.form.find("[data-vali="+ opts + "]");
                self.errorFlag = [];
                validator.each(function() {
                    var _val = $(this).val(),
                        valiRul = $(this).attr("data-vali");
                   if (valiRul && !_validateRules[valiRul]( _val )) {
                        // if (this.options.error && typeof this.options.error === 'function') {
                        //     this.options.error();
                        // }
                        $(this).closest(".wipos-input")
                            .addClass("has-error")
                            .removeClass("has-success");

                        self.errorFlag.push(false);
                    }  else {
                        $(this).closest(".wipos-input")
                            .addClass("has-success")
                            .removeClass("has-error");

                        self.errorFlag.push(true);
                    }
                });
            }
            // if (typeof this.options.error == 'function') {
            //         this.options.success();
            // }
            return self.errorFlag.indexOf(false) == -1 ? _data : false;
        },
        // 获取表单值
        getData : function(key, val) {
            var _data = this.data;
            if (!key && !val) {
                this.form.find("[name]").each(function() {
                    var $this = $(this),
                        field = $this.attr("name"),
                        _val = $this.val();
                    //if (_val) {
                        _data[field] = _val;
                    //}
                });
            } else {
                _data[key] = val;
            }
        },
        resetStyle: function() {
            this.form.find(".wipos-input").removeClass("has-error has-success");
        },
        // 事件绑定
        _bindEvents : function() {
            var self = this;
            this.form.find('[name]').bind({
                change:  function() {
                    var $this = $(this),
                        _formCheck = $this.attr("data-vali"),
                        _name = $this.attr("name"),
                        _val = $this.val();

                    if (_formCheck) {
                        _name ? self.validate(_name) : self.validate(_formCheck);
                    }

                },
                keyup: function() {
                    var $this = $(this),
                        _name = $this.attr("name"),
                        _val = $this.val();
                    self.getData(_name, _val);
                }
            });
        },
        // 默认验证规则
        defaultValidations : {
            'number': function(v) {
                v = stripWhitespace(v);
                if (v.length == 0) {
                    return true;
                }
                if (isNaN(v)) {
                    return false;
                }
                return true;
            },
            'email': function(v) {
                if (v.length == 0) {
                    return false;
                }
                var r = /^([a-zA-Z0-9_\.\-+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                return r.test(v);
            },
            "tel": function(v) {
                if (v.length == 0) {
                    return false;
                }
                var r = /^(1[3,5,8,7]{1}[\d]{9})|(((400)-(\d{3})-(\d{4}))|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{3,7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;

                return r.test(v);
            },
            "password": function(v) {
                if (v.length == 0) {
                    return false;
                }

                var r = /^((?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,20})$/;

                return r.test(v);
            },
            "notNull": function(v) {
                 if (v.length == 0) {
                    return false;
                }

                var r = /^.+$/;

                return r.test(v);
            },
            'url': function(v) {
                if (v.length == 0) {
                    return true;
                }
                if (v.match(/^www\./)) {
                    v = "http://" + v;
                }
                return v.match(/^(http\:\/\/|https\:\/\/)(.{4,})$/);
            }
        },
        _init : function() {
            this._bindEvents();
        }
    };

    window.WiValidate = function($dom, option) {
        var $this = $dom;
        return new ValidVal($this, option);
    };


    function stripWhitespace(str) {
        if (str === null) {
            return '';
        }
        if (typeof str == 'object') {
            for (var a in str) {
                str[a] = stripWhitespace(str[a]);
            }
            return str;
        }
        if (typeof str != 'string') {
            return '';
        }
        if (str.length == 0) {
            return '';
        }

        str = trim(str);

        var r = [' ', '-', '+', '(', ')', '/', '\\'];
        for (var i = 0, l = r.length; i < l; i++) {
            str = str.split(r[i]).join('');
        }
        return str;
    }
})(jQuery);
