var LowPassFilter = function () { this.init.apply(this, arguments); };

LowPassFilter.prototype = new (function () {
    LowPassFilter.SMOOTHING = 0.5;

    this.init = function () {
        this.data = 0;
        this.lastDataTime = 0;
    };

    this.addData = function (data) {
        this.data = this.data * LowPassFilter.SMOOTHING + data * (1 - LowPassFilter.SMOOTHING);
        this.lastDataTime = new Date().getTime();
    };

    this.getData = function () {
        return this.data * Math.pow(LowPassFilter.SMOOTHING, (new Date().getTime() - this.lastDataTime) / 20);
    };

    this.reset = function () {
        this.data = 0;
    };

})();
