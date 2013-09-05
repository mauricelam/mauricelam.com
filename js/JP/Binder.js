//=> Class

if (!JP || !JP.object || !JP.object.addons)
    throw 'JP is not properly defined';

(function () {

    // bind methods with $
    var binder = function (obj) {
        for (var method in obj) {
            if (Object.getPrototypeOf(obj).hasOwnProperty(method) &&
                typeof obj[method] === 'function' && obj['$' + method] === undefined) {
                Object.defineProperty(obj, '$' + method, {
                    value: obj[method].bind(obj)
                });
            }
        }
    };
    JP.object.addons.push(binder);

})();
