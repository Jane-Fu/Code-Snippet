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
        '<div class="calender-header">',
        '</div>',
        '<table>',
        '<tr><td><a href="javascript:void(0);" class="calender-btn J-prev-month">&lt;</a><span class="year"></span> 年<span class="month"></span> 月</td>',
        '<td><span class="year-next"></span> 年<span class="month-next"></span> 月<a href="javascript:void(0);" class="calender-btn J-next-month">&gt;</a></td></tr>',
        '<tr><td class="vt"><div class="calender-content J-calender-cur"></div></td><td class="vt"><div class="calender-content J-calender-next"></div></td></tr>',
        '<tr><td colspan="2"><a href="javascript:void(0);" class="calender-btn calender-sure J-calender-sure">确定</a></td></tr>',
        '</table></div>'
    ].join('');

    var tableHeader = '<table><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>';

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
            htmlNext = tableHeader;
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
                    html += '<td class="J-date-pick data-pick';
                    if ((i % 7 == 0) || (i % 7 == 6)) {
                        html += ' week';
                    }
                    html += '" data-date="' + monthArr[i].year + '/' + (monthArr[i].month + 1) + '/' + monthArr[i].date + '" >' + monthArr[i].date + '</td>';
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
                    htmlNext += '<td class="J-date-pick data-pick';
                    if ((i % 7 == 0) || (i % 7 == 6)) {
                        htmlNext += ' week';
                    }
                    htmlNext += '" data-date="' + nextArr[i].year + '/' + (nextArr[i].month + 1) + '/' + nextArr[i].date + '" >' + nextArr[i].date + '</td>';
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
            var $picks = $calender.find('.J-date-pick');
            var $self = $(this);
            var exist = $calender.find('.J-date-pick.on').length;
            if (exist == 0 || exist >= 2) {
                $picks.removeClass('on');
                $self.addClass('on');
            } else {
                var onIndex = $picks.index($calender.find('.J-date-pick.on'));
                var thisIndex = $picks.index(this);
                var big = onIndex > thisIndex ? onIndex : thisIndex;
                var small = onIndex > thisIndex ? thisIndex : onIndex;
                $picks.each(function(i) {
                    if (i <= big && i >= small) {
                        $(this).addClass('on');
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
                $this.val($ons.attr('data-date'));
                $calender.addClass('hide');
                return false;
            }
            $this.val($ons.first().attr('data-date') + '-' + $ons.last().attr('data-date'));
            $calender.addClass('hide');
            return false;
        });
        $('body').click(function() {
            $calender.addClass('hide');
        });
        $this.focus(function() {
            if ($this.val()) {
                var dateNow = $this.val().match(/^[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}/)[0];
                calender.set(dateNow);
            }
            calender.render($this);
        }).click(function(e) {
            e.stopPropagation();
        });
    };

    $.fn.doubleMonth = function() {
        $(this).each(calenderInit);
    };

})(jQuery);
