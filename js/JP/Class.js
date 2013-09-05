/**
 * Construct a default class object.
 *
 * Example:
 *
 * var MyClass = function () { JP.object(this, arguments); };
 *
 * MyClass.prototype = new (function () {
 *
 *     this.init = function () {
 *         // init function will be called automatically
 *     }
 *
 *     this.myfunc = function () {
 *     }
 *
 * });
 */

var JP = JP || {};

JP.object = function (obj, args) {

    if (!obj.proto) {
        var proto = Object.getPrototypeOf(obj);
        var superclass = Object.getPrototypeOf(proto);

        // bind super to object
        Object.defineProperty(proto, 'proto', { value: superclass });
        Object.defineProperty(obj, 'proto', { value: superclass });
    }

    // apply addons
    var addons = JP.object.addons;
    for (var i in addons) {
        addons[i](obj, args);
    }

    // call initialization function
    if (typeof obj.init === 'function')
        obj.init.apply(obj, args);

};

JP.object.addons = [];