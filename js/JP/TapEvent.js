//=> Events Modernizr


if (!JP || !JP.Events) {
    throw 'JP is not properly defined';
}

(function () {

    var TapGestureRecognizer = function () { JP.object(this, arguments); };

    TapGestureRecognizer.prototype = {

        init: function (element) {
            this.element = element;
            this.preventsDefault = false;
            this.stopsPropagation = false;

            this._failed = false;
            this._startEvent = null;
            this._lastEvent = null;

            element.addEventListener('touchstart', this.$touchStart, false);
            element.addEventListener('touchmove', this.$touchMove, false);
            element.addEventListener('touchend', this.$touchEnd, false);
        },

        unbind: function () {
            this.element.removeEventListener('touchstart', this.$touchStart, false);
            this.element.removeEventListener('touchmove', this.$touchMove, false);
            this.element.removeEventListener('touchend', this.$touchEnd, false);
        },

        _cloneEvent: function (event) {
            return { x: event.touches[0].pageX, y: event.touches[0].pageY, timeStamp: event.timeStamp };
        },

        touchStart: function (event) {
            if (this._startEvent === null) {
                this._lastEvent = this._startEvent = this._cloneEvent(event);
                this._failed = false;
            } else {
                this._failed = true;
            }
        },

        touchMove: function (event) {
            if (this._failed) return;
            if (Math.abs(this._startEvent.x - event.touches[0].pageX) > 22 || Math.abs(this._startEvent.y - event.touches[0].pageY) > 22) {
                this._failed = true;
            }
            this._lastEvent = this._cloneEvent(event);
        },

        touchEnd: function (event) {
            if (event.touches.length === 0) {
                if (!this._failed && !event._tapped) {
                    var tapEvent = document.createEvent('CustomEvent');
                    tapEvent.initCustomEvent('tap', true, true, {});
                    this.element.dispatchEvent(tapEvent);
                    event._tapped = true;
                    if (tapEvent.defaultPrevented) event.preventDefault();
                    if (tapEvent.cancelBubble) event.stopPropagation();
                }
                this._lastEvent = this._startEvent = null;
            } else {
                this._lastEvent = this._cloneEvent(event);
            }
        }
        
    };

    var addTap = function (element, listener, useCapture) {
        var recognizer = new TapGestureRecognizer(element, useCapture);
        element.gestureRecognizers = element.gestureRecognizers || {};
        element.gestureRecognizers[listener] = recognizer;
        return true;
    };

    var removeTap = function (element, listener) {
        if (element.gestureRecognizers[listener]){
            this.gestureRecognizers[listener].unbind();
            delete this.gestureRecognizers[listener];
        }
    };

    JP.Events.define('tap', {
        add: addTap,
        remove: removeTap
    });

    JP.Events.define('tap/click', {
        add: function (element, listener, useCapture) {
            // Minor quirk for tap/click event: the default action will not be executed on tap
            // (e.g. tapping on links will not go to the URL)
            var handler = function (event) {
                event.preventDefault();
                listener.apply(this, arguments);
            };
            element.JP.listen('tap', handler, useCapture);
            element.JP.listen('click', listener, useCapture);
            return false;
        },
        remove: function (element, listener, useCapture) {
            element.JP.stopListen('tap', listener);
            element.JP.stopListen('click', listener);
        }
    });

})();
