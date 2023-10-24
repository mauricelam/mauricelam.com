//=> JP

var LowPassFilter = function () { JP.object(this, arguments); };

LowPassFilter.prototype = new (function () {
    LowPassFilter.SMOOTHING = 0.5;

    this.init = function () {
        this.data = 0;
        this.lastDataTime = 0;
    };

    this.addData = function (data, time) {
        this.data = this.data * LowPassFilter.SMOOTHING + data * (1 - LowPassFilter.SMOOTHING);
        this.lastDataTime = time || new Date().getTime();
    };

    this.getData = function (time) {
        time = time || new Date().getTime();
        if (this.lastDataTime === 0) {
            return 0;
        }
        return this.data * Math.pow(LowPassFilter.SMOOTHING, (time - this.lastDataTime) / 20);
    };

    this.reset = function () {
        this.data = 0;
    };

})();
