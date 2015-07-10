define([
    'models/baseModel'
], function(
    BaseModel
) {
    var Sidebar = BaseModel.extend({
        defaults: {
            sections: {
                'WTFSWW': {
                    'Home': 'home'
                }
            }
        }
    });

    return Sidebar;
});