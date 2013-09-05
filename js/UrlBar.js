//=> Utils


/**
 * To use this, there are a few restrictions on the styles:
 *   HTML element must have 100% height
 *   Body must be box-sizing: border-box and margin: 0
 */

var UrlBar = {
    viewportScale: 1,
    _ready: false,
    _pendingHide: false,
    hide: function () {
        if (!this._ready) {
            this._pendingHide = true;
            return;
        }

        var barHeight = this.viewportScale * 240;
        if (document.body.getSize().height < window.innerHeight + barHeight) {
            document.body.style.height = (window.innerHeight + barHeight) + 'px';
            window.scrollTo(0, 1);
            document.body.style.height = window.innerHeight + 'px';
        } else {
            window.scrollTo(0, 1);
        }
        this._pendingHide = false;
    },
    show: function () {
        var oldHeight = document.body.style.height;
        document.body.style.height = '100%';
        window.setTimeout(function () {
            document.body.style.height = oldHeight;
        }, 0);
    },
    init: function () {
        this._ready = true;
        if (this._pendingHide) {
            this.hide();
        }
    }
};

(function () {

    if (navigator.userAgent.indexOf('iPhone') > -1) {
        window.addEventListener('DOMContentLoaded', function () {
            window.setTimeout(UrlBar.init, 1000);
        }, false);
    }

}());