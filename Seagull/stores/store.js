define(['Core','AbstractStorage'], function(Core,AbstractStorage) {
	var Avatar = {};
    Avatar.TEST = new Core.Class(AbstractStorage,{
        initialize: function ($super) {
            $super();
            this.key = 'TEST';
            this.lifeTime = '1D';
        },
        setCities: function (str) {
            this.setAttr("city",str);
        }
    });
    return Avatar;
});
