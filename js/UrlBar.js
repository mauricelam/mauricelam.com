//=> Utils


/**
 * To use this, there are a few restrictions on the styles:
 *   HTML element must have 100% height
 *   Body must be box-sizing: border-box and margin: 0
 */

var UrlBar = {};

(function () {

    UrlBar.viewportScale = 1;

    UrlBar.ready = false;
    UrlBar.pendingHide = false;

    UrlBar.hide = function () {
        if (!UrlBar.ready) {
            UrlBar.pendingHide = true;
            return;
        }

        var barHeight = UrlBar.viewportScale * 240;
        if (document.body.getSize().height < window.innerHeight + barHeight) {
            document.body.style.height = (window.innerHeight + barHeight) + 'px';
            window.scrollTo(0, 1);
            document.body.style.height = window.innerHeight + 'px';
        } else {
            window.scrollTo(0, 1);
        }
        UrlBar.pendingHide = false;
    };

    UrlBar.show = function () {
        var oldHeight = document.body.style.height;
        document.body.style.height = '100%';
        window.setTimeout(function () {
            document.body.style.height = oldHeight;
        }, 0);
    };

    UrlBar.init = function () {
        UrlBar.ready = true;
        if (UrlBar.pendingHide) {
            UrlBar.hide();
        }
    };

    if (navigator.userAgent.indexOf('iPhone') > -1) {
        window.addEventListener('DOMContentLoaded', function () {
            window.setTimeout(UrlBar.init, 1000);
        }, false);
    }

}());