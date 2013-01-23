var CompatibilityCheck = {};

(function() {

    var browserRequirements = {
        'csstransforms3d': 'CSS 3D transformations',
        'csstransitions': 'CSS Transitions'
    };

    CompatibilityCheck.getStatus = function () {
        for (var feature in browserRequirements) {
            if (!Modernizr[feature]) {
                return browserRequirements[feature];
            }
        }
        return null;
    };

})();