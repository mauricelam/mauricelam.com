//=> compatibility Utils ScrollRecognizer ProjectController Modernizr UrlBar

var WIDTH = 0;
var MAXSCROLL = 1500;
var MINSCROLL = 0;
var ROTATEFACTOR = 0.005;

var scrollPosition = 0;
var controller = null;

function internalScrollTo(position, animated, duration) {
    scrollPosition = Math.round(position);
    // var angle = -Math.atan((position + (window.innerWidth / 2) - (WIDTH / 2)) / 800);
    // var rotation = angle * ROTATEFACTOR;
    var tabletop = document.getElementById('tabletop');

    if (duration === undefined) {
        duration = 0.35;
    }

    if (animated) {
        tabletop.style[Modernizr.prefixed('transition')] = Modernizr.cssPrefixed('transform') + ' ' + duration + 's';
    } else {
        tabletop.style[Modernizr.prefixed('transition')] = 'none';
    }

    //tabletop.style[Modernizr.prefixed('transform')] = 'rotateX(10deg) rotateY('+ -rotation +'rad) rotateZ(' + rotation + 'rad) translateX('+ (-scrollPosition) +'px)';
    tabletop.style[Modernizr.prefixed('transform')] = 'rotateX(10deg) translateX(' + (-scrollPosition) + 'px)';

    var nameplate = document.getElementById('nameplate');
    var nameplateWidth = parseInt(window.getComputedStyle(nameplate).width, 10);
    var addPercent = (-scrollPosition + (WIDTH / 2) - nameplateWidth) / 3;

    if (animated) {
        nameplate.style[Modernizr.prefixed('transition')] = 'background-position ' + duration + 's';
    } else {
        nameplate.style[Modernizr.prefixed('transition')] = 'none';
    }
    nameplate.style.backgroundPosition = -addPercent + 'px 0';

    var scrollEvent = document.createEvent('CustomEvent');
    scrollEvent.initCustomEvent('3Dscroll', true, true, { animated: animated });
    tabletop.dispatchEvent(scrollEvent);
}

function scrollTableTo (position, animated, duration) {
    // position = Math.max(Math.min(position, MAXSCROLL), MINSCROLL);
    internalScrollTo(position, animated, duration);
}

function resize(event) {
    var eventType = event && event.type;
    if (navigator.userAgent.indexOf('iPhone') > -1 && (event === undefined || eventType == 'orientationchange')) {
        UrlBar.hide();
    }

    var yPos = window.innerHeight * 0.5 - 300;

    var tabletop = document.getElementById('tabletop');
    tabletop.style.top = yPos + 'px';

    var overlay = document.getElementById('overlay');
    overlay.style.top = (yPos + 90) + 'px';

    MAXSCROLL = WIDTH - window.innerWidth;
}

function startSplash() {
    resize();
    document.getElementById('wrap').style.opacity = 1;
    scrollTableTo((MAXSCROLL - MINSCROLL) / 2, true, 2);
}

var scrollRecognizer = null;

function init(event) {
    WIDTH = document.getElementById('tabletop').getSize().width;

    controller = new ProjectController();

    var meta = document.getElementById('meta-viewport');
    if (screen.width < 500 || screen.height < 500) {
        meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=no');
    } else {
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    scrollRecognizer = new ScrollRecognizer(window, 'scrollDelta');
    if (navigator.userAgent.indexOf('iPhone') > -1) {
        // Gradients does not work well with iOS devices :(
        // The height will be weird after hiding URL bar on iOS
        document.body.style.background = '#CCC';
    }
    // For iPhone, this wait for window.scrollTo to be possible (to hide the URL bar)
    // For others, wait for contents to be reasonably loaded
    window.setTimeout(startSplash, 1000);

    window.addEventListener('resize', resize, false);
    window.addEventListener('orientationchange', resize, false);
}

function scrollDelta(delta) {
    var position = scrollPosition - delta;

    // exponentially decaying overscroll
    if (scrollPosition < MINSCROLL && delta > 0) {
        position = scrollPosition - delta / (Math.pow(2, (MINSCROLL - scrollPosition) / 50) + 1);
    } else if (scrollPosition > MAXSCROLL && delta < 0) {
        position = scrollPosition - delta / (Math.pow(2, (scrollPosition - MAXSCROLL) / 50) + 1);
    }

    internalScrollTo(position);
}

document.addEventListener('DOMContentLoaded', init, false);
document.addEventListener('unload', function () {}, false); // prevent page cache
