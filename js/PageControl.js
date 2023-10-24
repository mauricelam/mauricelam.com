//=> JP

var PageControl = function () { JP.object(this, arguments); };

PageControl.prototype = {

    element: null,
    _numberOfPages: 0,

    init: function () {
        this.element = document.createElement('div');
        this.element.classList.add('pagecontrol');
    },

    setNumberOfPages: function (num) {
        this._numberOfPages = num;
        this.element.innerHTML = '';
        for (var i = 0; i < num; i++) {
            var dot = document.createElement('span');
            this.element.appendChild(dot);
        }
    }

};