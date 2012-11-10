//=> compatibility ScrollRecognizer ProjectController

var WIDTH = 4000;
var ROTATEFACTOR = 0.005;
var scrollPosition = 0;
var controller = null;

function scrollTableTo (position, animated, duration) {
    position = Math.max(Math.min(position, WIDTH - window.innerWidth), 0);
    scrollPosition = position;
    var angle = -Math.atan((position + (window.innerWidth / 2) - (WIDTH / 2)) / 800);
    var rotation = angle * ROTATEFACTOR;
    var tabletop = document.getElementById('tabletop');

    if (duration === undefined) {
        duration = 0.35;
    }

    if (animated) {
        tabletop.style.webkitTransition = '-webkit-transform '+duration+'s';
        tabletop.style.MozTransition = '-moz-transform '+duration+'s';
    } else {
        tabletop.style.webkitTransition = 'none';
        tabletop.style.MozTransition = 'none';
    }
    
    //tabletop.style.webkitTransform = 'rotateX(10deg) rotateY('+ -rotation +'rad) rotateZ(' + rotation + 'rad) translateX('+ (-scrollPosition) +'px)';
    tabletop.style.webkitTransform = 'rotateX(10deg) translateX('+ (-scrollPosition) +'px)';
    tabletop.style.MozTransform = 'rotateX(10deg) translateX('+ (-scrollPosition) +'px)';

    var nameplate = document.getElementById('nameplate');
    var nameplateWidth = parseInt(window.getComputedStyle(nameplate).width);
    var addPercent = (-scrollPosition + WIDTH/2 - nameplateWidth ) / 3;

    if (animated) {
        nameplate.style.webkitTransition = 'background-position '+duration+'s';
        nameplate.style.MozTransition = 'background-position '+duration+'s';
    } else {
        nameplate.style.webkitTransition = 'none';
        nameplate.style.MozTransition = 'none';
    }
    nameplate.style.backgroundPosition = -addPercent + 'px 0';

    var scrollEvent = document.createEvent("CustomEvent");
    scrollEvent.initCustomEvent("3Dscroll", true, true, { animated: animated });
    tabletop.dispatchEvent(scrollEvent);
}

var scrollRecognizer = null;

function init (event) {
    controller = new ProjectController();

    window.addEventListener('resize', resize, false);
    resize();

    window.setTimeout(scrollToMiddle, 500);
    scrollRecognizer = new ScrollRecognizer(window, 'scrollDelta');

    document.body.style.height = (window.innerHeight + 120) + 'px';
    setTimeout(function () {
      window.scrollTo(0, 1);
    }, 1000);

    var meta = document.getElementById('meta-viewport');
    if (window.innerWidth < 500 || window.innerHeight < 500) { 
        meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=1.0, user-scalable=no');
    } else {
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
}

function scrollDelta (delta) {
    scrollTableTo(scrollPosition - delta);
}

function scrollToMiddle () {
    scrollTableTo((WIDTH - window.innerWidth) / 2, true, 2);
}

function resize (event) {
    var yPos = window.innerHeight * 0.4 - 250;

    var tabletop = document.getElementById('tabletop');
    tabletop.style.top = yPos + 'px';

    var overlay = document.getElementById('overlay');
    overlay.style.top = yPos + 90 + 'px';
}

document.addEventListener('DOMContentLoaded', init, false);
document.addEventListener('unload', function () {}, false); // prevent page cache
