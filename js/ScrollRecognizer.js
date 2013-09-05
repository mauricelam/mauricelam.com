//=> JP Utils LowPassFilter Modernizr

var ScrollRecognizer = function () { JP.object(this, arguments); };

ScrollRecognizer.prototype = {

    FRICTION_FACTOR: 0.05,
    velocityMeter: new LowPassFilter(),
    steppingTimer: 0,
    deceleration: 0,
    lastEvent: null,
    startEvent: null,
    hasHorizontalScroll: false,
    hasTouch: false,

    init: function (callback, jumpCallback) {
        document.addEventListener('touchstart', this.$touchesBegan);
        document.addEventListener('touchmove', this.$touchesMoved);
        document.addEventListener('touchend', this.$touchesEnded);

        document.addEventListener('touchend', this.$touchesEndedInCapturingPhase, true);
        document.addEventListener('mousewheel', this.$handleWheel);
        document.addEventListener('DOMMouseScroll', this.$handleWheel);
        document.addEventListener('scroll', this.$handleScroll);

        this.callback = callback;
        this.jumpCallback = jumpCallback;
    },

    handleWheel: function (event) {
        var wheelDeltaY = (event.wheelDeltaY) ? event.wheelDeltaY : (event.axis === 2) ? event.detail * -40 : 0;
        var wheelDeltaX = (event.wheelDeltaX) ? event.wheelDeltaX : (event.axis === 1) ? event.detail * -40 : 0;
        this.hasHorizontalScroll = this.hasHorizontalScroll || wheelDeltaX !== 0;
        if (!this.hasHorizontalScroll) {
            event.stopPropagation();
            event.preventDefault();
            document.body.scrollLeft -= wheelDeltaY;
            document.documentElement.scrollLeft -= wheelDeltaY;
        }
        // Scroll horizontally if only vertical
    },

    handleScroll: function (event) {
        if (this.hasTouch) return; // Based on the fact the you must touch to scroll
        this.jumpCallback(document.body.scrollLeft || document.documentElement.scrollLeft);
    },

    scrollDirection: null,

    touchesBegan: function (event) {
        this.hasTouch = true;
        if (this.startEvent === null) {
            clearInterval(this.steppingTimer);
            this.lastEvent = this.startEvent = event;
            scrollDirection = null;
        }
    },

    touchesMoved: function (event) {
        if (scrollDirection === 'vertical') {
            return;
        } else if (scrollDirection === 'horizontal') {
            event.preventDefault();
        }

        if (Math.abs(Utils.getDeltaX(event, this.startEvent)) > 22) {
            scrollDirection = 'horizontal';
        } else if (Math.abs(Utils.getDeltaY(event, this.startEvent)) > 22) {
            scrollDirection = 'vertical';
        }

        var delta = Utils.getDeltaX(event, this.lastEvent);
        this.callback(delta);
        if (this.lastEvent) {
            this.velocityMeter.addData(delta / (event.timeStamp - this.lastEvent.timeStamp) * 25, event.timeStamp);
        }
        this.lastEvent = event;
    },

    touchesEnded: function (event) {
        if (event.touches.length === 0) {
            deceleration = this.velocityMeter.getData(event.timeStamp) * 1.5;
            this.steppingTimer = window.setInterval(this.$stepToCompletion, 20); // ~60 fps
        }
    },

    touchesEndedInCapturingPhase: function (event) {
        if (event.touches.length === 0) {
            this.lastEvent = this.startEvent = null;
        }
    },

    stepToCompletion: function () {
        this.callback(deceleration);
        deceleration *= (1 - this.FRICTION_FACTOR);
        if (Math.abs(deceleration) < 3) {
            clearInterval(this.steppingTimer);
            this.velocityMeter.reset();
        }
    }

};
