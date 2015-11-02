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