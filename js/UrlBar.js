//=> Utils

var UrlBar = {};

(function () {

    UrlBar.ready = false;
    UrlBar.pendingHide = false;

    UrlBar.hide = function () {
        if (!UrlBar.ready) {
            UrlBar.pendingHide = true;
            return;
        }

        // if (Utils.getComputedHeight(document.body) < window.innerHeight + 44) {
            document.body.style.height = (window.innerHeight + 44) + 'px';
            window.scrollTo(0, 1);
            // document.body.style.height = window.innerHeight + 'px';
        // } else {
            // window.scrollTo(0, 1);
        // }
        UrlBar.pendingHide = false;
    };

    UrlBar.show = function () {
        var oldHeight = document.body.style.height;
        document.body.style.height = '100%';
        document.body.style.height = oldHeight;
    };

    UrlBar.init = function () {
        UrlBar.ready = true;
        if (UrlBar.pendingHide) {
            UrlBar.hide();
        }
    };

    window.addEventListener('DOMContentLoaded', function () {
        window.setTimeout(UrlBar.init, 1000);
    }, false);

}());