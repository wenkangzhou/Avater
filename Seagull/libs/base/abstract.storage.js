/**
 * @class AbsctractStorage
 * @description Storage抽象类
 */
define(['Core', 'UtilityDate'], function(Core, UtilityDate) {

    "use strict";
    var CDate = UtilityDate,
        overdueClearKey = "ClEAR_OVERDUE_CATCH";//存储缓存中的key和过期时间
    /**
     * @class AbsctractStorage
     */
    var AbstractStorage = new Core.Class({
        initData: function() {
            this.proxy = localStorage;
        },
        propertys: function() {
            /**
             * @member lifeTime
             * @type {String}
             * @description 数据存活时间, 参数传递格式为“时间+时间单位",如30M
             * 时间单位有D:day,H:hour,M:minutes,S:secend,
             * 如过不传递时间单位,默认时间单位为M
             */
            this.lifeTime = '30M';
        },

        /**
         * @method initialize
         * @param {Object} obj
         * @description 复写自顶层Class的initialize
         */
        initialize: function() {
            this.initData();
            this.propertys();
            this.removeOverdueCathch();
            this.assert();
        },
        assert: function() {
        },
        /**
         *删除过期缓存
         * @private
         */
        removeOverdueCathch: function() {
            //比较缓存中的过期时间是否超过了最新时间
            var dateNow = new CDate().getTime(),
                objsdInCatchStr = this.proxy.getItem(overdueClearKey),
                objsdInCatch = [],
                objsCatchNew = [];
            if (!objsdInCatchStr) {
                return;
            }
            objsdInCatch = JSON.parse(objsdInCatchStr);
            for (var i = 0, tempObj; i < objsdInCatch.length; i++) {
                tempObj = objsdInCatch[i];
                if (new Date(tempObj.timeout).getTime() <= dateNow) {
                    //过期的删除
                    this.proxy.removeItem(tempObj.key);
                } else {
                    //未过期添加到新的数组中
                    objsCatchNew.push(tempObj);
                }
            };
            //最后将新数组放到缓存中
            this.proxy.setItem(overdueClearKey, JSON.stringify(objsCatchNew));
        },
        /**
         * 将缓存的key和过期时间放到缓存中
         * @param key
         * @param timeout
         * @private
         */
        setOverdueCathch: function(key, timeout) {

            if (!key || !timeout) {
                return;
            };
            var overdueObj = {},
                oldObjs = [],
                oldObjsStr = this.proxy.getItem(overdueClearKey);
            overdueObj.key = key;
            overdueObj.timeout = timeout;
            if (oldObjsStr) {
                oldObjs = JSON.parse(oldObjsStr);
            }
            var isKeyAlreadyIn = false;
            for (var i = 0, tempObj; i < oldObjs.length; i++) {
                tempObj = oldObjs[i];
                if (tempObj.key == key) {
                    //更新最新的过期时间
                    oldObjs[i] = overdueObj;
                    isKeyAlreadyIn = true;
                }
            }
            if (!isKeyAlreadyIn) {
                //添加新的过期时间对象
                oldObjs.push(overdueObj);
            }
            //最后将新数组放到缓存中
            this.proxy.setItem(overdueClearKey, JSON.stringify(oldObjs));
        },
        /**
         * @method _buildStorageObj
         * @param value
         * @param timeout
         */
        buildStorageObj: function(value, timeout) {
            return {
                value: value,
                timeout: timeout
            }
        },
        /**
         * @method _getLifeTime
         * @returns {number} 根据liftTime 计算要增加的毫秒数
         * @description } 根据liftTime 计算要增加的毫秒数
         * @private
         */
        getLifeTime: function() {
            var timeout = 0;
            var str = this.lifeTime + "";
            var unit = str.charAt(str.length - 1);
            var num = +str.substring(0, str.length - 1);
            if (typeof unit == 'number') {
                unit = 'M';
            } else {
                unit = unit.toUpperCase();
            }

            if (unit == 'D') {
                timeout = num * 24 * 60 * 60;
            } else if (unit == 'H') {
                timeout = num * 60 * 60;
            } else if (unit == 'M') {
                timeout = num * 60;
            } else if (unit == 'S') {
                timeout = num;
            } else {
                //默认为秒
                timeout = num * 60;
            }
            return timeout;
        },
        /**
         * @method _getNowTime
         * @description 活动当前时间 useServerTime:true 返回服务器时间,false返回本地时间
         */
        getNowTime: function() {
            return new CDate();
        },
        /**
         * @method set
         * @param {String} key 数据Key值
         * @param {Object} value 数据对象
         * @param {Date} timeout 可选,数据失效时间,如不传,默认过期时间为当前日期过会30天
         * @return {Boolean} 成功true,失败false
         * @desctription 向Store中存放数据
         */
        set: function(key, value) {
            var time = this.getNowTime();
            time.addSeconds(this.getLifeTime());
            var timeout = time ? new CDate(time) : new CDate().addDay(30);
            var formatTime = timeout.format('Y/m/d H:i:s');
            //将key和过期时间放到缓存中
            this.setOverdueCathch(key, formatTime);

            var entity = this.buildStorageObj(value, formatTime);
            try {
                this.proxy.setItem(key, JSON.stringify(entity));
                return true;
            } catch (e) {
                //localstorage写满时,全清掉
                if (e.name == 'QuotaExceededError') {
                    this.proxy.clear();
                }
                console && console.log(e);
            }
            return false;
        },

        /**
         * @method get
         * @param {String} key 数据Key会值
         * @return {Object} 取回保存的数据
         * @description 根据key获取value值,如指定的key或attrName未定义返回null
         */
        get: function(key) {
            var result,
                value = null;
            try {
                result = this.proxy.getItem(key);
                if (result) {
                    result = JSON.parse(result);
                    value = result.value;
                }
            } catch (e) {
                console && console.log(e);
            }
            return value;
        },
        /**
         * @method remove
         * @param {String} key 数据key值
         * @description 清除指定key
         */
        remove: function(key) {
            return this.proxy.removeItem(key);
        },
        /**
         * @method getAll
         * @return {Array} result,形式如[{key:'aa',value:{}}]
         * @description 返回storage存储的所有数据
         */
        getAll: function() {
            var ln = this.proxy.length;
            var vs = [];
            for (var i = 0; i < ln; i++) {
                var key = this.proxy.key(i);
                var obj = {
                    key: key,
                    value: this.get(key)
                }
                vs.push(obj);
            }
            return vs;
        },

        /**
         * @method clear
         * @discription 清空所有storage内容
         */
        clear: function() {
            this.proxy.clear();
        },

        /**
         * @method gc
         * @discription 垃圾收集,清掉失效的数据
         */
        gc: function() {
            var storage = this.proxy,
                ln = this.proxy.length;
            for (var i = 0; i < ln; i++) {
                var name = storage.key(i);
                if (name == 'GUID') {
                    break;
                }
                try {
                    if (!this.get(name)) {
                        this.remove(name);
                    }
                } catch (e) {}
            }
        }

    });

    return AbstractStorage;
});