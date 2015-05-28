define(['Core','AbstractStorage'], function(Core,AbstractStorage) {
	var Awatar = {};
    Awatar.TEST = new Core.Class(AbstractStorage,{
        initialize: function () {
            this.key = 'TEST';
            this.lifeTime = '1D';
        },
        setCities: function (str) {
            this.setAttr("city",str);
        }
    });
    Awatar.NAXT = new Core.Class(AbstractStorage,{
        propertys: function() {
            this.lifeTime = '2D';
        }
    }); 
    return Awatar;
});
