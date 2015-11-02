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