define(['Core','AbstractStorage'], function(Core,AbstractStorage) {
	var Awatar = {};
    Awatar.TEST = new Core.Class(AbstractStorage,{
        propertys: function() {
            this.lifeTime = '1D';
        }
    });
    Awatar.NAXT = new Core.Class(AbstractStorage,{
        propertys: function() {
            this.lifeTime = '2D';
        }
    }); 
    return Awatar;
});