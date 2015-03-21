define(['Core','AbstractModel'], function(Core,AbstractModel) {
    var Awatar = {},
        RestUrl = "http://m.ctrip.com/restapi/soa2/10079";
    Awatar.TEST = new Core.Class(AbstractModel,{
        initialize: function (){
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
    Awatar.NAXT = new Core.Class(AbstractModel,{
        initialize: function (){
            this.url = "/SHXHomeSearch";
            /* 参数 */
            this.param = {
                "Version":5100,
                "SearchInfo":{
                    "CityID":2
                }
            };
            this.dataformat = function (data){
                return data;
            }
        },
        buildurl: function () {
            return RestUrl;
        }
    });
    return Awatar;
});