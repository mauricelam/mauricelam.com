//=> Modernizr

var Utils = {};

(function () {

    Modernizr.cssPrefixed = function (prop) {
        var prefixed = Modernizr.prefixed(prop);
        return prefixed.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
    };

    Utils.getComputedHeight = function (element){
        var height;
        if(element.offsetHeight !== undefined){
                height = element.offsetHeight;
        } else {
                height = document.defaultView.getComputedStyle(element, '').getPropertyValue('height');
                height = height.split('px')[0];
        }
        return height;
    };

    Utils.createImageCanvas = function (image, width, height) {
        var canvas = document.createElement('canvas');
        
        var drawOnCanvas = function() {
            canvas.style.width  = width + 'px';
            canvas.style.height = height + 'px';
            canvas.width = width;
            canvas.height = height;

            var context = canvas.getContext('2d');
            context.clearRect(0, 0, width, height);
            context.drawImage(image, 0, 0, width, height);
        };

        if (image.complete) {
            drawOnCanvas();
        } else {
            image.addEventListener('load', drawOnCanvas, false);
        }
        return canvas;
    };

    Utils.getDeltaX = function (currentEvent, lastEvent) {
        // Chrome for Android likes this
        var delta = currentEvent.touches[0].pageX - lastEvent.touches[0].pageX;
        if (!delta) {
            // iOS uses this better
            delta = currentEvent.pageX - lastEvent.pageX;
        }
        return delta;
    };

    Utils.getDeltaY = function (lastEvent, currentEvent) {
        // Chrome for Android likes this
        var delta = currentEvent.touches[0].pageY - lastEvent.touches[0].pageY;
        if (!delta) {
            // iOS uses this better
            delta = currentEvent.pageY - lastEvent.pageY;
        }
        return delta;
    };

    Object.defineProperty(Object.prototype, '$', {
        value: function () {
            for (var i = 0; i < arguments.length; i++) {
                var method = arguments[i];
                if (this['$' + method] === undefined) {
                    this['$' + method] = this[method].bind(this);
                }

                if (arguments.length === 1) {
                    return this['$' + method];
                }
            }
        }
    });

}());