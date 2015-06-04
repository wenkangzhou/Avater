/**
 * @class AbsctractStorage
 * @description Storage抽象类
 */
define(['Core', 'UtilityDate', 'UtilityObject'], function(Core, UtilityDate, UtilityObject) {

    "use strict";
    var CDate = UtilityDate,
        HObject = UtilityObject,
        overdueClearKey = "ClEAR_OVERDUE_CATCH"; //存储缓存中的key和过期时间
    /**
     * @class AbsctractStorage
     */
    var AbstractStorage = new Core.Class({
        propertys: function() {

            /**
             * @member lifeTime
             * @type {String}
             * @description 数据存活时间, 参数传递格式为“时间+时间单位",如30M
             * 时间单位有D:day,H:hour,M:minutes,S:secend,
             * 如过不传递时间单位,默认时间单位为M
             */
            //this.lifeTime = '30M';
            this.key = "default";
            this.lifeTime = "30M";
        },

        /**
         * @method initialize
         * @param {Object} obj
         * @description 复写自顶层Class的initialize
         */
        initialize: function() {
            this.propertys();
            this.removeOverdueCathch();
        },
        /**
         *删除过期缓存
         * @private
         */
        removeOverdueCathch: function() {
            //比较缓存中的过期时间是否超过了最新时间
            var dateNow = new CDate().getTime(),
                objsdInCatchStr = localStorage.getItem(overdueClearKey),
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
            localStorage.setItem(overdueClearKey, JSON.stringify(objsCatchNew));
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
                oldObjsStr = localStorage.getItem(overdueClearKey);
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
            localStorage.setItem(overdueClearKey, JSON.stringify(oldObjs));
        },
        /**
         * @method _buildStorageObj
         * @param value
         * @param timeout
         */
        buildStorageObj: function(value, timeout, savedate) {
            return {
                value: value,
                timeout: timeout,
                savedate: savedate
            }
        },
        /*
         * @param {String| Int}num
         * @description 删除离过期时间最近的缓存
         */
        removeOdCLately: function(num) {
            num = num || 5;
            var objsdInCatchStr = localStorage.getItem(overdueClearKey),
                objsdInCatch = [];
            if (objsdInCatchStr) {
                objsdInCatch = JSON.parse(objsdInCatchStr);
                //排序删除第一个，排序比较耗时
                objsdInCatch.sort(function(a, b) {
                    var timeA = new Date(a.timeout).getTime(),
                        timeB = new Date(b.timeout).getTime();
                    return timeA - timeB
                });
                //删除N个 缓存
                var delCatch = objsdInCatch.splice(0, num) || [];
                for (var i = 0; i < delCatch.length; i++) {
                    localStorage.removeItem(delCatch[i].key);
                }
                //将剩余的key存入缓存中
                localStorage.removeItem(overdueClearKey);
                if (objsdInCatch.length > 0) {
                    localStorage.setItem(overdueClearKey, JSON.stringify(objsdInCatch));
                }
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
         * @description 活动当前时间
         */
        getNowTime: function() {
            return new CDate();
        },
        /**
         * 向Store中添加数据
         * @param {Object} value 要添加的数据
         */
        set: function(value) {
            var time = this.getNowTime();
            time.addSeconds(this.getLifeTime());
            this.setStorage(this.key, value, time, null);
        },
        /**
         * 设置属性值
         * @param {String} attrName  支持通过路径的方式，如 setAttr('global.user.name','张三')
         * @param {Object} attrVal 属性值
         */
        setAttr: function(attrName, attrVal) {
            if (_.isObject(attrName)) {
                for (var i in attrName) {
                    if (attrName.hasOwnProperty(i)) this.setAttr(i, attrName[i], attrVal);
                }
                return;
            }
            var obj = this.getStorage(this.key) || {};
            if (obj) {
                HObject.set(obj, attrName, attrVal);
                return this.set(obj);
            }
            return false;
        },
        /**
         * @param {String} key 数据Key值
         * @param {Object} value 数据对象
         * @param {Date} [timeout] 可选,数据失效时间,如不传,默认过期时间为当前日期过会30天
         * @return {Boolean} 成功true,失败false
         * @desctription 向Store中存放数据
         */
        setStorage: function(key, value, timeout, savedate) {
            savedate = savedate || (new CDate()).format('Y/m/d H:i:s');
            timeout = timeout ? new CDate(timeout) : new CDate().addDay(30);
            var formatTime = timeout.format('Y/m/d H:i:s');
            //将key和过期时间放到缓存中
            this.setOverdueCathch(key, formatTime);
            var entity = this.buildStorageObj(value, formatTime, savedate);
            try {
                localStorage.setItem(key, window.JSON.stringify(entity));
                return true;
            } catch (e) {
                //localstorage写满时,全清掉
                if (e.name == 'QuotaExceededError') {
                    //localstorage写满时，选择离过期时间最近的数据删除，这样也会有些影响，但是感觉比全清除好些，如果缓存过多，此过程比较耗时，100ms以内
                    this._removeOdCLately();
                    this.setStorage(key, value, timeout, savedate);
                }
                console && console.log(e);
            }
            return false;
        },
        /**
         * 获取已存取数据
         * @return {Object} result Store中存储的数据
         */
        get: function() {
            var result = null,
                isEmpty = true;
            var obj = this.getStorage(this.key);
            var type = typeof obj;
            if (({'string': true,'number': true,'boolean': true})[type]) return obj;
            if (obj) {
                if (Object.prototype.toString.call(obj) == '[object Array]') {
                    result = [];
                    for (var i = 0, ln = obj.length; i < ln; i++) {
                        result[i] = obj[i];
                    }
                } else {
                    if (obj && !result) result = {};
                    _.extend(result, obj);
                }
            }
            for (var a in result) {
                isEmpty = false;
                break;
            }
            return !isEmpty ? result : null;
        },
        /**
         * @param {String} attrName 支持通过路径的方式，如 getAttr('global.user.name')
         * @returns {Object} value 数据的属性值
         * @description 获取已存取对象的属性
         */
        getAttr: function(attrName) {
            var obj = this.getStorage(this.key),
                attrVal = null;
            if (obj) {
                attrVal = HObject.get(obj, attrName);
            }
            return attrVal;
        },
        /**
         * @param {String} key 数据Key会值
         * @return {Object} 取回保存的数据
         * @description 根据key获取value值,如指定的key或attrName未定义返回null
         */
        getStorage: function(key) {
            var result, value = null;
            try {
                result = localStorage.getItem(key);
                if (result) {
                    result = window.JSON.parse(result);
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
            return localStorage.removeItem(key);
        },
        /**
         * @method getAll
         * @return {Array} result,形式如[{key:'aa',value:{}}]
         * @description 返回storage存储的所有数据
         */
        getAll: function() {
            var ln = localStorage.length;
            var vs = [];
            for (var i = 0; i < ln; i++) {
                var key = localStorage.key(i);
                var obj = {
                    key: key,
                    value: this.get(key)
                }
                vs.push(obj);
            }
            return vs;
        }
    });
    /**
     * 获得store的实例
     */
    AbstractStorage.getInstance = function() {
        if (this.instance instanceof this) {
            return this.instance;
        } else {
            return this.instance = new this;
        }
    };
    return AbstractStorage;
});
