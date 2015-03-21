(function() {
    var app = 'libs/';
    require.config({
        shim: {
            _: {
                exports: '_'
            }
        },
        paths: {
            'text': app + '3dlibs/require.text',
            'Swipe': app + '3dlibs/swipe',
            'AbstractApp': app + 'base/abstract.app',
            'AbstractView': app + 'base/abstract.view',
            'AbstractModel': app + 'base/abstract.model',
            'AbstractStorage': app + 'base/abstract.storage',
            'Core': app + 'base/core.inherit',
            'Ajax': app + 'common/ajax',
            'UtilityDate': app + 'common/utility.date',
            'Models': 'models/model',
            'Stores': 'stores/store'
        }
    });
})();