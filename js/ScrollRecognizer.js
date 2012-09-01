//=> LowPassFilter

var ScrollRecognizer = function () { this.init.apply(this, arguments); };

ScrollRecognizer.prototype = new (function () {

    var FRICTION_FACTOR = 0.05;

    var velocityMeter = new LowPassFilter();
    var steppingTimer = 0;
    var deceleration = 0;
    var lastEvent = null;

    this.init = function (target, action) {
        document.addEventListener('mousewheel', this.handleWheel.bind(this), false); // WebKit
        document.addEventListener('DOMMouseScroll', this.handleWheel.bind(this), false); // Firefox

        document.addEventListener('touchstart', this.touchesBegan.bind(this), false);
        document.addEventListener('touchmove', this.touchesMoved.bind(this), false);
        document.addEventListener('touchend', this.touchesEnded.bind(this), false);

        this.target = target;
        this.action = action;
    };

    this.handleWheel = function (event) {
        var wheelDelta = (event.wheelDeltaX) ? event.wheelDeltaX : (event.axis == 1) ? event.detail * -40 : 0;
        event.stopPropagation();
        event.preventDefault();
        var dx = wheelDelta / 4;
        this.target[this.action](dx);
    }

    this.touchesBegan = function (event) {
        if (steppingTimer) {
            clearInterval(steppingTimer);
        }
        lastEvent = event;
        //event.preventDefault();
    }

    this.touchesMoved = function (event) {
        event.preventDefault();
        var delta = event.pageX - lastEvent.pageX;
        this.target[this.action](delta);
        if (lastEvent) {
            velocityMeter.addData(delta / (event.timeStamp - lastEvent.timeStamp) * 20);
        }
        lastEvent = event;
    }

    this.touchesEnded = function (event) {
        deceleration = velocityMeter.getData();
        steppingTimer = window.setInterval(function () {
            this.stepToCompletion();
        }.bind(this), 20); // ~60 fps
    }

    this.stepToCompletion = function () {
        this.target[this.action](deceleration);
        deceleration *= (1 - FRICTION_FACTOR);
        if (Math.abs(deceleration) < 3) {
            clearInterval(steppingTimer);
            velocityMeter.reset();
        }
    }

})();
