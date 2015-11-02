// switch
;(function(){
    $.fn.switchCheck = function(){
        var $this = $(this);
        var $label = $('<label class="switch-checkbox off"></label>');
        if ($this.closest('label').length) {
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
        $this.change(function(){
            var _checked = $this.prop('checked');
            if (_checked) {
                $label.removeClass('off');
            } else {
                $label.addClass('off');
            }
        });
    };
})(jQuery);