define(['Core', 'AbstractView', 'Models', 'Stores', getViewTemplatePath('tao'), 'Swipe'], function(Core, View, Models, Stores, viewhtml) {
    var PageView = new Core.Class(View, {
        onCreate: function() {
            this.$el.html(viewhtml);
            console.log('onCreate事件，会执行并且只会执行一次');
        },
        events: {
            "click .photo": function() {
                this.forward("index");
            }
        },
        onPreShow: function() {
            console.log('onPreShow事件，每次都会执行，执行最后执行turning方法便可显示view');
            this.turning();
        },
        onShow: function() {
            var datas = {
                tao:
                [
                    {
                        time: "2015-03-11", 
                        vol: "544", 
                        coversrc: "http://lazyseagull.com/img/tao/tao_20141207.jpg", 
                        websrc: "http://t.cn/RzwbUXS", 
                        etc: "AISEN - 可弯曲超软洗手刷。AISEN 可弯曲超软洗手刷，清洗双手死角，指甲，连手指之间细微的部分也是容易清洗到的。弹性十足，可弯曲，柔软质地不伤手，使用放心。"
                    },
                    {
                        time: "2015-03-12", 
                        vol: "545", 
                        coversrc: "http://lazyseagull.com/img/tao/tao_20141207.jpg", 
                        websrc: "http://t.cn/RzwbUXS", 
                        etc: "AISEN1 - 可弯曲超软洗手刷。AISEN 可弯曲超软洗手刷，清洗双手死角，指甲，连手指之间细微的部分也是容易清洗到的。弹性十足，可弯曲，柔软质地不伤手，使用放心。"
                    }
                ]
                
            }
            this.$el.html(_.template(viewhtml, datas)); 
            var elem = this.$el.find("#mySwipe")[0];//document.getElementById('mySwipe');

            window.mySwipe = Swipe(elem, {
              // startSlide: 4,
              // auto: 3000,
                continuous: false,
              // disableScroll: true,
              // stopPropagation: true,
                callback: function(index, element) {console.log(index+"###"+element)},
              // transitionEnd: function(index, element) {}
            });
            //好让空白区也能滑动
            this.$el.find(".container").css("height",document.body.scrollHeight-100);
        },
        onHide: function() {
            console.log('onHide事件，每次切换我将隐藏时候我会触发');
        }
    });
    return PageView;
});