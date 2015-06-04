define(['Core', 'Ajax'], function(Core, ajax) {

    var AbstractModel = new Core.Class({
        initData: function() {
            this.dataformat = null;
            this.contentType = 'json';
            this.method = 'POST';
            this.url = null;
            this.param = null;  
        },

        initialize: function() {
            this.initData();
        },

        setParam: function(key, val) {
            if (typeof key === 'object' && !val) {
                this.param = key;
            } else {
                this.param[key] = val;
            }
        },

        getParam: function() {
            return this.param;
        },

        //构建url请求方式，子类可复写
        buildurl: function() {
            throw "[ERROR]abstract method:buildurl, must be override";
        },

        /**
         *	取model数据
         *	@param {Function} onComplete 取完的回调函
         *	传入的第一个参数为model的数第二个数据为元数据，元数据为ajax下发时的ServerCode,Message等数
         *	@param {Function} onError 发生错误时的回调
         *	@param {Boolean} ajaxOnly 可选，默认为false当为true时只使用ajax调取数据
         * @param {Boolean} scope 可选，设定回调函数this指向的对象
         * @param {Function} onAbort 可选，但取消时会调用的函数
         */
        execute: function(onComplete, onError, scope, onAbort, params) {

            // @description 请求数据的地址
            var url = this.buildurl()+this.url;

            var self = this;

            var __onComplete = $.proxy(function(data) {

                // @description 对获取的数据做字段映射
                var datamodel = typeof this.dataformat === 'function' ? this.dataformat(data) : data;

                if (typeof onComplete === 'function') {
                    onComplete.call(scope || this, datamodel, data);
                }

            }, this);

            var __onError = $.proxy(function(e) {

                if (typeof onError === 'function') {
                    onError.call(scope || this, e);
                }

            }, this);

            // @description 从this.param中获得数据，做深copy
            var params = params || _.clone(this.getParam() || {});

            //设置contentType无效BUG，改动一，将contentType保存
            params.contentType = this.contentType;

            if (this.contentType === 'json') {
                // @description 跨域请求
                ajax.cros(url, this.method, params, __onComplete, __onError);
            } else if (this.contentType === 'jsonp') {
                // @description jsonp的跨域请求
                ajax.jsonp(url, params, __onComplete, __onError);
            } else {
                // @description 默认post请求
                ajax.post(url, params, __onComplete, __onError);
            }
        }
    });
    /**
     * 获得model的实例
     */
    AbstractModel.getInstance = function() {
        if (this.instance instanceof this) {
            return this.instance;
        } else {
            //this.superclass.prototype.initialize();
            return this.instance = new this;
        }
    };
    return AbstractModel;
});
