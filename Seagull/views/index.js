define(['Core', 'AbstractView', 'Models', 'Stores', getViewTemplatePath('index'), 'Swipe'], function(Core, View, Models, Stores, viewhtml) {
    var testModel = Models.TEST.getInstance();
    var testStore = Stores.TEST.getInstance();
    var mysqlTestModel = Models.MYSQLTEST.getInstance();
    var PageView = new Core.Class(View, {
        onCreate: function() {
            this.$el.html(viewhtml);
            console.log('onCreate事件，会执行并且只会执行一次');
        },
        events: {
            "click .tao": function() {
                this.forward("tao");
            }
        },
        onPreShow: function() {
            console.log('onPreShow事件，每次都会执行，执行最后执行turning方法便可显示view');
            this.turning();
        },
        onShow: function() {
            //TEST
            testModel.execute(function(data){console.log(data)},function(e){console.log(e)});
            testStore.setCities("wohaha");
            testStore.setAttr("ha","hello1");
            testStore.setAttr("haha","hello2");
            console.log(testStore.get());
            console.log(testStore.getAttr("haha"));
            mysqlTestModel.execute(function(data){console.log(data)},function(e){console.log(e)});
            //TEST END
            var datas = {
                photo:
                [
                    {
                        time: "2015-03-11", 
                        vol: "544", 
                        src: "http://lazyseagull.com/img/photo/photo_20141205.jpg", 
                        name: "猫", 
                        author: "SIHAOGOR",
                        quotation: "我想所谓孤独,就是你面对的那个人,他的情绪和你自己的情绪,不在同一个频率。from《十一种孤独》"
                    },
                    {
                        time: "2015-03-12", 
                        vol: "541", 
                        src: "http://lazyseagull.com/img/photo/photo_20141205.jpg", 
                        name: "猫1", 
                        author: "SIHAOGOR1",
                        quotation: "我1想所谓孤独,就是你面对的那个人,他的情绪和你自己的情绪,不在同一个频率。from《十一种孤独》"
                    }
                ]
                
            }
            this.$el.html(_.template(viewhtml, datas)); 
            var elem = this.$el.find("#mySwipe")[0];// document.getElementById('mySwipe');

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
