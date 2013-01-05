var TapGestureRecognizer = function TapGestureRecognizer () { this.init.apply(this, arguments); };

TapGestureRecognizer.prototype = new (function() {

    this.init = function (element) {
        this.$('touchStart', 'touchMove', 'touchEnd');

        element.addEventListener('touchstart', this.$touchStart, false);
        element.addEventListener('touchmove', this.$touchMove, false);
        element.addEventListener('touchend', this.$touchEnd, false);

        this.element = element;
        this.preventsDefault = false;
        this.stopsPropagation = false;

        this._failed = false;
        this._startEvent = null;
        this._lastEvent = null;
    };

    this.unbind = function () {
        this.element.removeEventListener('touchstart', this.$touchStart, false);
        this.element.removeEventListener('touchmove', this.$touchMove, false);
        this.element.removeEventListener('touchend', this.$touchEnd, false);
    };

    function cloneEvent (event) {
        return { x: event.touches[0].pageX, y: event.touches[0].pageY, timeStamp: event.timeStamp };
    }

    this.touchStart = function (event) {
        if (this._startEvent === null) {
            this._lastEvent = this._startEvent = cloneEvent(event);
            this._failed = false;
        } else {
            this._failed = true;
        }
    };

    this.touchMove = function (event) {
        if (this._failed) return;
        if (Math.abs(this._startEvent.x - event.touches[0].pageX) > 22 || Math.abs(this._startEvent.y - event.touches[0].pageY) > 22) {
            this._failed = true;
        }
        this._lastEvent = cloneEvent(event);
    };

    this.touchEnd = function (event) {
        if (event.touches.length === 0) {
            if (!this._failed) {
                var tapEvent = document.createEvent('CustomEvent');
                tapEvent.initCustomEvent('tap', true, true, {});
                this.element.dispatchEvent(tapEvent);
                if (this.stopsPropagation) event.stopPropagation();
                if (this.preventsDefault) event.preventDefault();
            }
            this._lastEvent = this._startEvent = null;
        } else {
            this._lastEvent = cloneEvent(event);
        }
        
    };
    
})();

Node.prototype._addEventListener = Node.prototype.addEventListener;
Node.prototype.addEventListener = function (type, listener, useCapture) {
    var recognizer;
    if (type === 'tap') {
        recognizer = new TapGestureRecognizer(this);
        this.gestureRecognizers = this.gestureRecognizers || {};
        this.gestureRecognizers[listener] = recognizer;
    }
    this._addEventListener.apply(this, arguments);
    return recognizer;
};

Node.prototype._removeEventListener = Node.prototype.removeEventListener;
Node.prototype.removeEventListener = function (type, listener, useCapture) {
    if (this.gestureRecognizers[listener]) {
        this.gestureRecognizers[listener].unbind();
        delete this.gestureRecognizers[listener];
    }
    this._removeEventListener.apply(this, arguments);
};