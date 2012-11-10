var PageControl = function () { this.init.apply(this, arguments); };

PageControl.prototype = new (function () {

    this.init = function () {
        this.element = document.createElement('div');
        this.element.classList.add('pagecontrol');
    };

    this.setNumberOfPages = function (num) {
        this._numberOfPages = num;
        this.element.innerHTML = '';
        for (var i = 0; i < num; i++) {
            var dot = document.createElement('span');
            this.element.appendChild(dot);
        }
    };

})();