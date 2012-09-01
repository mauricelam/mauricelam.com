/****************************
 * Function.prototype.bind
 ****************************/

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
 
        var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
 
    return fBound;
  };
}

/****************************
 * isTouchDevice
 ****************************/

 function isTouchDevice () {
    return ("ontouchstart" in window);
 }

/****************************
 * Touch event additions
 ****************************/

var touchEventExtension = {
    startEvent: null,
    lastEvent: null
};

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('touchstart', touchEventExtension.touchStart, true);
    document.addEventListener('touchmove', touchEventExtension.touchMove, true);
    document.addEventListener('touchend', touchEventExtension.touchEnd, true);
}, false);

touchEventExtension.touchStart = function (event) {
    touchEventExtension.lastEvent = touchEventExtension.startEvent = event;
};

touchEventExtension.touchMove = function (event) {
    touchEventExtension.lastEvent = event;
};

touchEventExtension.touchEnd = function (event) {
};

Object.defineProperty(TouchEvent.prototype, 'lastEvent', {
    get: function () {
        return touchEventExtension.lastEvent;
    }
});

Object.defineProperty(TouchEvent.prototype, 'startEvent', {
    get: function () {
        return touchEventExtension.startEvent;
    }
});

 /****************************
 * Canvas additions
 ****************************/

 HTMLCanvasElement.prototype.applyFilter = function (func) {
    // WARNING: this function is fairly slow as you would expect performing math on every pixel using CPU
    var context = this.getContext("2d");
    var width = this.width, height = this.height;
    var imageData;
    
    try {
        imageData = context.getImageData( 0, 0, width, height );
    } catch(e) {
        throw new Error("unable to access image data: " + e);
    }

    var pixels = imageData.data;
    for (var i=0; i < width; i++) {
        for (var j=0; j < height; j++) {
            var index = (i*4) * width + (j*4);
            var pixel = {
                r: pixels[index],
                g: pixels[index+1],
                b: pixels[index+2],
                a: pixels[index+3]
            };
            func.apply(this, [pixel, pixels]);
            pixels[index] = pixel.r;
            pixels[index+1] = pixel.g;
            pixels[index+2] = pixel.b;
            pixels[index+3] = pixel.a;
        }
    }
    context.putImageData(imageData, 0,0,0,0, width, height);
 }

 HTMLCanvasElement.prototype.saveCache = function (id) {
    var cache = document.createElement('canvas');
    cache.width = this.width;
    cache.height = this.height;
    cache.getContext('2d').drawImage(this, 0, 0);
    this['cache_' + id] = cache;
 }

 HTMLCanvasElement.prototype.restoreCache = function (id) {
    var cache = this['cache_' + id];
    if (cache) {    
        var context = this.getContext('2d');
        context.clearRect(0, 0, this.width, this.height);
        context.drawImage(cache, 0, 0);
        return true;
    } else {
        return false;
    }
 }