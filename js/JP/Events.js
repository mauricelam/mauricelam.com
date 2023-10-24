//=> Class

var JP = JP || {};

(function () {
    
    JP.Events = {};
    JP.Events.customEvents = {};

    JP.Events.define = function (type, definition) {
        JP.Events.customEvents[type] = definition;
    };

    var JPEvent = function () { JP.object(this, arguments); };

    JPEvent.prototype = new (function () {

        this.init = function (element) {
            this.element = element;
            this.listeners = {};
        };

        this.listenOnce = function (eventType, listener, useCapture) {
            var self = this; // binding will destroy the state
            var _listener = function () {
                listener.apply(this, arguments);
                self.stopListen(eventType, _listener);
            };

            this.listen(eventType, _listener, useCapture);
        };

        this.listen = function (eventType, listener, useCapture) {
            useCapture = (useCapture === true);

            this.listeners[eventType] = this.listeners[eventType] || [];
            this.listeners[eventType].push([listener, useCapture]);

            var shouldRegisterListener = true;
            if (eventType in JP.Events.customEvents) {
                var definition = JP.Events.customEvents[eventType];
                shouldRegisterListener = definition.add(this.element, listener, useCapture);
            }

            if (shouldRegisterListener)
                this.element.addEventListener(eventType, listener, useCapture);
        };

        this.listenInCapturingPhase = function (eventType, listener) {
            this.listen(eventType, listener, true);
        };

        this.stopListen = function (eventType, listener) {
            var definition = JP.Events.customEvents[eventType];
            
            var listeners = this.listeners[eventType];
            for (var i in listeners) {
                if (listener === undefined || listeners[i][0] == listener)  {
                    this.element.removeEventListener(eventType, listeners[i][0], listeners[i][1]);
                    delete this.listeners[eventType][i];
                    if (definition) {
                        definition.remove(this.element, eventType, listeners[i][0], listeners[i][1]);
                    }
                }
            }
        };

    })();

    Object.defineProperty(Node.prototype, 'JP', {
        get: function () { if (!this['-JP']) this['-JP'] = new JPEvent(this); return this['-JP']; }
    });

})();