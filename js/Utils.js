//=> Modernizr

/*global CSSStyleDeclaration Element WebKitPoint */

var Utils = {};

(function () {

    /**********
     * Modernizr
     **********/

    Modernizr.cssPrefixed = function (prop) {
        var prefixed = Modernizr.prefixed(prop);
        return prefixed && prefixed.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
    };

    /**********
     * Prefixed properties
     **********/

    var prefixedProperties = ['transform', 'transition'];

    function CSSPrefixer(style) {
        this.createProp = function (prop) {
            var prefixedProp = Modernizr.prefixed(prop);
            var definition = {
                set: function (value) {
                    if (typeof value === 'string') {
                        value = value.replace(/--(.+?)\b/g, function (str, m1) { return Modernizr.cssPrefixed(m1); });
                    }
                    style[prefixedProp] = value;
                },
                get: function () { return style[prefixedProp]; }
            };

            Object.defineProperty(this, prop, definition);
        };

        for (var i = 0, count = prefixedProperties.length; i < count; i++) {
            this.createProp(prefixedProperties[i]);
        }
    }

    var pDefinition = {
        get: function () {
            if (!this['-style'])
                Object.defineProperty(this, '-style', { 'value': new CSSPrefixer(this) });
            return this['-style'];
        }
    };
    Object.defineProperty(CSSStyleDeclaration.prototype, 'p', pDefinition);

    /**********
     * Element sizes
     **********/

    Element.prototype.getSize = function () {
        return { width: this.offsetWidth, height: this.offsetHeight };
    };

    Element.prototype.getContentSize = function () {
        var size = {};
        var style = window.getComputedStyle(this, null);
        size.width = Number(style.getPropertyValue('width').split('px')[0]);
        size.height = Number(style.getPropertyValue('height').split('px')[0]);
        return size;
    };

    /**********
     * Geometry (Point conversion)
     **********/

    Node.prototype.parentOf = function(child) {
        while ((child = child.parentNode) && child !== this) {}
        //If child is defined then we didn't walk all the way up to the root
        return child ? true : false;
    };

    var _offsetForElement = function(element) {
        var boundingClientRect,
            elementsDocument = element.ownerDocument,
            elementsDocumentElement,
            elementsBody,
            elementsWindow;

        if ( element && elementsDocument ) {
            elementsDocumentElement = elementsDocument.documentElement;
            elementsBody = elementsDocument.body;
            elementsWindow = elementsDocument.defaultView;

            if ( element !== elementsBody ) {
                boundingClientRect = element.getBoundingClientRect();
                if ( elementsDocumentElement.parentOf(element) ) {
                    var clientTop  = elementsDocumentElement.clientTop  || elementsBody.clientTop  || 0,
                        clientLeft = elementsDocumentElement.clientLeft || elementsBody.clientLeft || 0,
                        scrollTop  = elementsWindow.pageYOffset || elementsDocumentElement.scrollTop  || elementsBody.scrollTop,
                        scrollLeft = elementsWindow.pageXOffset || elementsDocumentElement.scrollLeft || elementsBody.scrollLeft,
                        top  = boundingClientRect.top  + scrollTop  - clientTop,
                        left = boundingClientRect.left + scrollLeft - clientLeft;
                    return { top: top, left: left };
                } else {
                    return { top: boundingClientRect.top, left: boundingClientRect.left };
                }

            } else {
                return { top: elementsBody.offsetTop, left: elementsBody.offsetLeft };
            }
       } else {
            return null;
        }
    };

    if (window.WebKitPoint && window.webkitConvertPointFromNodeToPage) {
        Utils.convertPointFromNodeToPage = function(element, point) {
            var webkitPoint = (point) ? new WebKitPoint(point.x, point.y) : new WebKitPoint(0, 0);

            point = window.webkitConvertPointFromNodeToPage(element, webkitPoint);
            return point;
        };

        Utils.convertPointFromPageToNode = function(element, point) {
            var webkitPoint = (point) ? new WebKitPoint(point.x, point.y) : new WebKitPoint(0, 0);

            point = window.webkitConvertPointFromPageToNode(element, webkitPoint);
            return point;
        };
    } else {
        Utils.convertPointFromNodeToPage = function(element, point) {
            if (!element || element.x !== undefined) {
                return null;
            }
            var offset = _offsetForElement(element);
            var output = (point) ? { x: point.x, y: point.y } : { x: 0, y: 0 };

            if (offset) {
                output.x += offset.left;
                output.y += offset.top;
            }
            return output;
        };

        Utils.convertPointFromPageToNode = function(element, point) {
            if (!element || element.x !== undefined) {
                return null;
            }
            var offset = _offsetForElement(element);
            var output = (point) ? { x: point.x, y: point.y } : { x: 0, y: 0 };
            
            if (offset) {
                output.x -= offset.left;
                output.y -= offset.top;
            }
            return output;
        };
    }

    /**********
     * Canvas additions
     **********/

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

    /**********
     * Touch Events handling
     **********/

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

    /**********
     * Function binding
     **********/

    var bindFunction = function () {
        for (var i = 0, count = arguments.length; i < count; i++) {
            var method = arguments[i];
            if (this['$' + method] === undefined) {
                this['$' + method] = this[method].bind(this);
            }

            if (arguments.length === 1) {
                return this['$' + method];
            }
        }
    };

    Object.defineProperty(Object.prototype, '$', { 'value': bindFunction });

}());