//=> Utils LowPassFilter

var ScrollRecognizer = function () { this.init.apply(this, arguments); };

ScrollRecognizer.prototype = new (function () {

    var FRICTION_FACTOR = 0.05;

    var velocityMeter = new LowPassFilter();
    var steppingTimer = 0;
    var deceleration = 0;
    var lastEvent = null;
    var startEvent = null;
    var hasHorizontalScroll = false;

    this.init = function (target, action) {
        this.$('handleWheel', 'touchesBegan', 'touchesMoved', 'touchesEnded', 'touchesEndedInCapturingPhase');

        document.addEventListener('mousewheel', this.$handleWheel, false); // WebKit
        document.addEventListener('DOMMouseScroll', this.$handleWheel, false); // Firefox

        document.addEventListener('touchstart', this.$touchesBegan, false);
        document.addEventListener('touchmove', this.$touchesMoved, false);
        document.addEventListener('touchend', this.$touchesEnded, false);

        document.addEventListener('touchend', this.$touchesEndedInCapturingPhase, true);

        this.target = target;
        this.action = action;
    };

    this.handleWheel = function (event) {
        var wheelDelta = (event.wheelDelta) ? event.wheelDelta : event.detail * -40;
        var horizontalWheelDelta = (event.wheelDeltaX) ? event.wheelDeltaX : (event.axis == 1) ? event.detail * -40 : 0;
        if (horizontalWheelDelta !== 0 || hasHorizontalScroll) {
            wheelDelta = horizontalWheelDelta;
            hasHorizontalScroll = true;
        }
        event.stopPropagation();
        event.preventDefault();
        var dx = wheelDelta / 4;
        this.target[this.action](dx);
    };

    var scrollDirection = null;

    this.touchesBegan = function (event) {
        if (startEvent === null) {
            if (steppingTimer) {
                clearInterval(steppingTimer);
            }
            lastEvent = startEvent = event;
            scrollDirection = null;
        }
    };

    this.touchesMoved = function (event) {
        if (scrollDirection == 'vertical') {
            return;
        } else if (scrollDirection == 'horizontal') {
            event.preventDefault();
        }

        if (Math.abs(Utils.getDeltaX(event, startEvent)) > 22) {
            scrollDirection = 'horizontal';
        } else if (Math.abs(Utils.getDeltaY(event, startEvent)) > 22) {
            scrollDirection = 'vertical';
        }

        var delta = Utils.getDeltaX(event, lastEvent);
        this.target[this.action](delta);
        if (lastEvent) {
            velocityMeter.addData(delta / (event.timeStamp - lastEvent.timeStamp) * 25, event.timeStamp);
        }
        lastEvent = event;
    };

    this.touchesEnded = function (event) {
        if (event.touches.length === 0) {
            deceleration = velocityMeter.getData(event.timeStamp) * 1.5;
            steppingTimer = window.setInterval(function () {
                this.stepToCompletion();
            }.bind(this), 20); // ~60 fps
        }
    };

    this.touchesEndedInCapturingPhase = function (event) {
        if (event.touches.length === 0) {
            lastEvent = startEvent = null;
        }
    };

    this.stepToCompletion = function () {
        this.target[this.action](deceleration);
        deceleration *= (1 - FRICTION_FACTOR);
        if (Math.abs(deceleration) < 3) {
            clearInterval(steppingTimer);
            velocityMeter.reset();
        }
    };

})();
