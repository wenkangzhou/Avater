define(['Core','AbstractModel'], function(Core,AbstractModel) {
    var Avatar = {},
        RestUrl = "http://m.ctrip.com/restapi/soa2/10079";
    Avatar.TEST = new Core.Class(AbstractModel,{
        initialize: function ($super){
            $super();
            this.url = "/SHXHomeAd";
            /* 参数 */
            this.param = {
                "Version": 6000
            };
        },
        buildurl: function () {
            return RestUrl;
        }
    });
    Avatar.MYSQLTEST = new Core.Class(AbstractModel,{
        initialize: function ($super){
            $super();//执行父级的initialize
            this.url = "/test/mysqlconnect/2";
            /* 参数 */
            this.param = {
                username:"jimmy", 
                content:"test"
            };
            //this.contentType = "json";
            //this.method = "post";
        },
        buildurl: function () {
            return "http://localhost:8096/nabuke";
        }
    });
    return Avatar;
});
