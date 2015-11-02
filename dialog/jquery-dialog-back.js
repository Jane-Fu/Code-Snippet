// Dialog
;(function($){
    var html =
    '<div class="alert-layout Dialog">' +
        '<div class="alert">' +
            '<a href="javascript:void(0);" class="alert-close J-alert-close"></a>' +
            '<h3></h3>' +
            '<div class="alert-content">' +
            '</div>' +
            '<div class="alert-btns"><a href="javascript:void(0);" class="btn J-alert-sure">确认</a>' +
            '<a href="javascript:void(0);" class="btn btn-cancel J-alert-close J-alert-cancel">关闭</a></div>' +
        '</div>' +
    '</div>';

    var dialog = [],
        removeDialog = function( obj ){
            for( var i = 0,_len = dialog.length; i < _len ; i ++ ){
                if ( dialog[i] == obj ) {
                    dialog.splice(i,1);
                }
            }
        },
        position = function( dom,index ){
            if (index > 1) {
                var pre = dialog[index - 2];
                dom.css({
                    top : pre.$dom.offset().top + 20,
                    left : pre.$dom.offset().left + 20
                });
            } else {
                var width = dom.outerWidth(),
                    height = dom.outerHeight(),
                    $window = $(window),
                    bodyWidth = $window.width(),
                    bodyHeight = $window.height(),
                    scrollTop = $window.scrollTop();
                dom.css({
                    top : (bodyHeight/2 - height/2)/3*2 + scrollTop,
                    left : bodyWidth/2 - width/2
                });
            }

        };
    function Dialog( option ){
        var self = this;
        self.option = option;
        self.$dom = $(html);
        self.$title = self.$dom.find('h3');
        self.$content = self.$dom.find('.alert-content');
        self.$close = self.$dom.find('.J-alert-close');
        self.closeTimeout = null;
        self.create();
    }
    Dialog.prototype.create = function(){
        var self = this;
        if ( self.option.title ) {
            self.$title.html(self.option.title);
        }
        if ( self.option.content ) {
            self.$content.html(self.option.content);
        }
        if ( self.option.sure ) {
            self.$dom.find('.J-alert-sure').click(function(){
                self.option.sure.call(self);
            });
        }
        if ( self.option.cancel ) {
            self.$dom.find('.J-alert-cancel').click(function(){
                self.option.cancel.call(self);
            });
        }
        self.$close.mousedown(function(){
            self.close();
            return false;
        });
        self.index = dialog.push(self);
        self.$dom.appendTo('body').addClass('animate');
        position(self.$dom,self.index);
        self.bindMove();
    };
    Dialog.prototype.close = function(){
        var self = this;
        self.$dom.fadeOut(function(){
            self.$dom.remove();
            if ( self.option.close ) {
                self.option.close.call(self);
            }
            removeDialog(self);
        });
        try{
           self.offMousemove();
        }catch(e){}
        try{
            clearTimeout(self.closeTimeout);
        }catch(e){}
    };
    Dialog.prototype.mousemove = function(x,y){
        var self = this;
        $('body').on('mousemove.' + self.moveingTag,function(e){
            if (self.moving) {
                self.$dom.css({
                    top: e.pageY - y,
                    left: e.pageX - x
                }).addClass('on');
            }
        });
    };
    Dialog.prototype.offMousemove = function(x,y){
        var self = this;
         $('body').off('mousemove.' + self.moveingTag);
         self.$dom.removeClass('on');
    };
    Dialog.prototype.bindMove = function(){
        var self = this;
        self.moveingTag = 'alertMoving' + (new Date().getTime());
        self.$dom.find('.alert').mousedown(function(e){
            self.moving = true;
            self.mousemove(e.pageX - self.$dom.offset().left,e.pageY - self.$dom.offset().top);
        }).mouseup(function(){
            self.offMousemove();
        });
    };

    $.Dialog = function(option){
        if ( dialog.length > 0 ) {
            return false;
        }
        new Dialog(option);
    };
})(jQuery);