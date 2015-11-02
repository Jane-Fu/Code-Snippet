;(function($){
    var fillZero = function(_num){
        if (_num == undefined ) { 
            return null;
        }
        _num = _num + '';
        return _num.length == 1 ? "0" + _num : _num;
    };

    var isLeap = function(year){
        if (!(year % 400) || !(year % 4) && (year % 100) ) {
            return true;
        } else {
            return false;
        }
    };

    var daysNum = [31,28,31,30,31,30,31,31,30,31,30,31];

    var getMonthDay = function(year,month){
        if (month == 1 && isLeap(year)) {
            return 29;
        } else {
            return daysNum[month];
        }
    };

    var getDay = function(dateStr){
        if (dateStr) {
            return new Date(dateStr).getDay();
        } else {
            return new Date().getDay();
        }
    };

    var getArray = function(year, month, date){
        var prev,prevMonth,prevYear;
        if (month > 0) {
            prev = getMonthDay(year, month - 1);
            prevMonth = month - 1;
            prevYear = year;
        } else {
            prev = getMonthDay(year-1, 11);
            prevMonth = 11;
            prevYear = year - 1;
        }
        var nextMonth,nextYear;
        if (month < 11) {
            nextMonth = month + 1;
            nextYear = year;
        } else {
            nextMonth = 0;
            nextYear = year + 1;
        }
        var firstDay = getDay(year + '/' + (month + 1)  + '/' + 1);
        var monthDay = getMonthDay(year, month);
        var _array = [];
        for (var i = 1; i <= monthDay; i++ ) {
            _array.push({
                year:year,
                month:month,
                date:i
            });
        }
        for (var i = 1; i <= (42 - monthDay - firstDay); i++ ) {
            _array.push({
                year:nextYear,
                month:nextMonth,
                date:i
            });
        }
        for (var i = 0; i < firstDay; i++) {
            _array.unshift({
                year:prevYear,
                month:prevMonth,
                date:prev - i
            });
        };
        return _array;
    };

    var calenderOuter = [
        '<div class="calender-layout hide">',
        '<div class="calender-header">',
        '<a href="javascript:void(0);" class="calender-btn J-prev-year">&lt;</a>',
        '<span class="year"></span> 年',
        '<a href="javascript:void(0);" class="calender-btn J-next-year">&gt;</a>',
        '<a href="javascript:void(0);" class="calender-btn J-prev-month">&lt;</a>',
        '<span class="month"></span> 月',
        '<a href="javascript:void(0);" class="calender-btn J-next-month">&gt;</a>',
        '<a href="javascript:void(0);" class="calender-today J-calender-today J-date-pick">今天</a>',
        '</div>',
        '<div class="calender-content J-calender-content"></div>',
        '</div>'
    ].join('');

    var tableHeader = '<table><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>';

    function Calender(time ,parent){
        var date,today;
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
        if (parent) {
            this.parent = parent;
        }
        this.value = getArray(this.year, this.month, this.date);
    }

    Calender.prototype.set = function(time){
        Calender.call(this,time);
    }
    Calender.prototype.prevMonth = function(){
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
    }

    Calender.prototype.nextMonth = function(){
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
    }

    Calender.prototype.prevYear = function(){
        this.year--;
        this.date = 1;
        var time = this.year + '/' + (this.month + 1) + '/' + this.date;
        Calender.call(this, time);
        return this;
    }

    Calender.prototype.nextYear = function(){
        this.year++;
        this.date = 1;
        var time = this.year + '/' + (this.month + 1) + '/' + this.date;
        Calender.call(this, time);
        return this;
    }

    Calender.prototype.render = function($dom){
        var value = this.value,
            month = this.month,
            html = tableHeader;
        for ( var i = 0,len = value.length; i <= len; i ++ ){
            if (i % 7 == 0 && i == 0) {
                html += '<tr>';
            } else if ( i % 7 == 0 && value[i]){
                html += '</tr><tr>';
            } else if ( i % 7 == 0 && !value[i] ) {
                html += '</tr>';
            }
            if (value[i]) {
                html += '<td class="J-date-pick';
                if( (i % 7 == 0 ) || (i % 7 == 6 ) ){
                    html += ' week';
                }
                if (value[i].month != month) {
                    html += ' not-now';
                }
                html += '" data-date="' + value[i].year + '/' + (value[i].month + 1) + '/' + value[i].date + '" >'+ value[i].date + '</td>'
            }
        }
        this.parent.find('.year').html(this.year);
        this.parent.find('.month').html(this.month + 1);
        this.parent.find('.J-calender-content').html(html);
        this.parent.find('.J-calender-today').attr('data-date', this.today);
        this.parent.appendTo('body');
        var top = $dom.offset().top + $dom.outerHeight(),
            left = $dom.offset().left;
        this.parent.css({
            position : 'absolute',
            top: top,
            left: left
        }).removeClass('hide');
    }

    var calenderInit = function(){
        var $this = $(this),
            $calender = $(calenderOuter),
            _val = $this.val();

        var calender = new Calender(_val ,$calender);
        
        $calender.click(function(e){
            e.stopPropagation();
        });
        $calender.on('click','.J-next-year',function(){
            calender.nextYear().render($this);
        });
        $calender.on('click','.J-prev-year',function(){
            calender.prevYear().render($this);
        });
        $calender.on('click','.J-next-month',function(){
            calender.nextMonth().render($this);
        });
        $calender.on('click','.J-prev-month',function(){
            calender.prevMonth().render($this);
        });
        $calender.on('click','.J-date-pick',function(){
            var _date = $(this).attr('data-date');
            $this.val(_date);
            $calender.addClass('hide');
        });

        $('body').click(function(){
            $calender.addClass('hide');
        });
        $this.focus(function(){
            if ($this.val()) {
                calender.set($this.val());
            }
            calender.render($this);
        }).click(function(e){
            e.stopPropagation();
        });
    }

    $.fn.calender = function(){
        $(this).each(calenderInit);
    }

})(jQuery);