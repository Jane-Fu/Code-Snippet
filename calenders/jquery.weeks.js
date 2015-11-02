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

    var getPerMonth = function(year){
        var _days = [31,28,31,30,31,30,31,31,30,31,30,31];
        if ( isLeap(year)) {
            _days[1] = 29;
        }
        return _days;
    };

    var getDay = function(dateStr){
        if (dateStr) {
            return new Date(dateStr).getDay();
        } else {
            return new Date().getDay();
        }
    };


    var getArray = function(year, current){
        var firstDay = getDay(year +'/1/1'),
        days = getPerMonth(year),
        past = 0,
        weeks = [],
        today = (new Date().getTime() - new Date(year + '/1/1').getTime())/24/60/60/1000;
            if (firstDay > 1 && firstDay < 6) {
            weeks.push({ from: [year - 1,12,31 + 2 - firstDay ].join('/'), to: [year, 1, 8 - firstDay].join('/') });
            past = 8 - firstDay;
            today = today + firstDay - 1;
        } else if ( firstDay == 0 ){
            past = 1;
            today = today - past;
        } else if ( firstDay == 6 ){
            past = 2;
            today = today - past;
        }
        current = current || Math.floor(today/7);

        for (var i = 0,len = days.length; i < len; i++ ){(function(){
                    var num = days[i];
                    while(num - past >= 8){
                        weeks.push({from: [year,i + 1, past + 1].join('/'), to: [year, i + 1, past + 7].join('/') });
                        past += 7;
                    }
                    if (num - past > 0 && i < 11) {
                        weeks.push({from: [year,i + 1, past + 1].join('/'), to: [year, i + 2, past + 7 - num].join('/') });
                        past = past + 7 - num;
                    } else if ( num - past > 0 && i == 11 ){
                        weeks.push({from: [year,i + 1, past + 1].join('/'), to: [year + 1, 1, past + 7 - num].join('/') });
                    } else if ( num - past == 0 ) {
                        past = 0;
                    }
                })()}
        return { weeks : weeks, current : current};
    };

    var html = '<div class="weeks-header"><a href="javascript:void(0);" class="J-prev-year">&lt;</a>'+
            '<span class="J-year"></span> 年 ' + 
            '<a href="javascript:void(0);" class="J-next-year">&gt;</a></div>';

    function Weeks(year, current, parent){
        if (parent) {
            this.parent = parent;
        }
        this.year = year || new Date().getFullYear();
        this.current = current || this.current;
        this.data = getArray(this.year, this.current);
    }

    Weeks.prototype.set = function(year){
        Weeks.call(this, year);
        return this;
    }

    Weeks.prototype.prevYear = function(){
        this.year--;
        Weeks.call(this, this.year);
        return this;
    }

    Weeks.prototype.nextYear = function(){
        this.year++;
        Weeks.call(this, this.year);
        return this;
    }

    Weeks.prototype.render = function($dom){
        var weeks = this.data.weeks,
            current = this.data.current - 1;
        var _html = html;
        console.log(this.year);
        _html += '<ul>';
        for ( var i = 0,len = weeks.length; i < len; i ++ ){
            if (current == i) {
                _html = _html + '<dl class="current" data-week="' + this.year + '年 第' + (i + 1) +'周"><dt>' + (i + 1) + '</dt><dd>' + weeks[i].from +' </br> ' + weeks[i].to + '</dd></dl>';
            } else {
                _html = _html + '<dl data-week="' + this.year + '年 第' + (i + 1) +'周"><dt>' + (i + 1) + '</dt><dd>' + weeks[i].from +' </br> ' + weeks[i].to + '</dd></dl>';
            }
        }
        _html += '</ul>';
        this.parent.html(_html);
        this.parent.find('.J-year').html(this.year);
        this.parent.appendTo('body');
        var top = $dom.offset().top + $dom.outerHeight(),
            left = $dom.offset().left;
        this.parent.css({
            position : 'absolute',
            top: top,
            left: left
        }).removeClass('hide');
    }

    var weeksInit = function(){
        var $this = $(this),
            _val = $this.val(),
            $parent = $('<div class="J-weeks weeks-layout">');
        var _result = _val.match(/^(\d+)\u5e74\s\u7b2c(\d+)\u5468$/);
        if(_result && _result[1] && _result[2]) {
            var week = new Weeks(_result[1] ,_result[2], $parent);
        } else {
            var week = new Weeks(null , null, $parent);
        }
        
        $parent.click(function(e){
            e.stopPropagation();
        });

        $parent.on('click','.J-next-year',function(){
            week.nextYear().render($this);
        });

        $parent.on('click','.J-prev-year',function(){
            week.prevYear().render($this);
        });

        $parent.on('click','dl',function(){
            var _str = $(this).attr('data-week');
            $this.val(_str);
            $parent.addClass('hide');
        });

        $('body').click(function(){
            $parent.addClass('hide');
        });

        $this.focus(function(){
            week.render($this);
        })
        .click(function(e){
            e.stopPropagation();
        });
    }

    $.fn.weeks = function(){
        $(this).each(weeksInit);
    }

})(jQuery);