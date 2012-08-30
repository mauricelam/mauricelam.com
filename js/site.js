var WIDTH = 4000;
var ROTATEFACTOR = 0.005;
var scrollPosition = 0;
var controller = null;

function scroll (event) {
    var wheelDelta = (event.wheelDeltaX) ? event.wheelDeltaX : (event.axis == 1) ? event.detail * -40 : 0;
    event.stopPropagation();
    event.preventDefault();
    var dx = wheelDelta;
    scrollTo(scrollPosition - dx/4);
}

function scrollTo (position, animated) {
    //controller.deselectProject();

    position = Math.max(Math.min(position, WIDTH - window.innerWidth), 0);
    scrollPosition = position;
    var angle = -Math.atan((position + (window.innerWidth / 2) - (WIDTH / 2)) / 800);
    var rotation = angle * ROTATEFACTOR;
    var tabletop = document.getElementById('tabletop');

    if (animated) {
        tabletop.style.webkitTransition = '-webkit-transform 0.35s';
        tabletop.style.MozTransition = '-moz-transform 0.35s';
    } else {
        tabletop.style.webkitTransition = 'none';
        tabletop.style.MozTransition = 'none';
    }
    
    tabletop.style.webkitTransform = 'rotateX(10deg) rotateY('+ -rotation +'rad) rotateZ(' + rotation + 'rad) translateX('+ (-scrollPosition) +'px)';
    tabletop.style.MozTransform = 'rotateX(10deg) rotateY('+ -rotation +'rad) rotateZ(' + rotation + 'rad) translateX('+ (-scrollPosition) +'px)';

    var nameplate = document.getElementById('nameplate');
    var nameplateWidth = parseInt(window.getComputedStyle(nameplate).width);
    var addPercent = (-scrollPosition + WIDTH/2 - nameplateWidth ) / 3;

    if (animated) {
        nameplate.style.webkitTransition = '-webkit-filter 0.5s, background-position 0.35s';
        nameplate.style.MozTransition = '-moz-filter 0.5s, background-position 0.35s';
    } else {
        nameplate.style.webkitTransition = '-webkit-filter 0.5s';
        nameplate.style.MozTransition = '-moz-filter 0.5s';
    }
    nameplate.style.backgroundPosition = -addPercent + 'px 0';

    var scrollEvent = document.createEvent("CustomEvent");
    scrollEvent.initCustomEvent("3Dscroll", true, true, { animated: animated });
    tabletop.dispatchEvent(scrollEvent);
}

function init (event) {
    console.log('init')
    controller = new ProjectController();

    window.addEventListener('resize', resize, false);
    resize();

    scrollTo((WIDTH - window.innerWidth) / 2);
    document.addEventListener('mousewheel', scroll, false); // WebKit
    document.addEventListener('DOMMouseScroll', scroll, false); // Firefox
}

function resize (event) {
    var yPos = window.innerHeight * 0.4 - 250;

    var tabletop = document.getElementById('tabletop');
    tabletop.style.top = yPos + 'px';

    var overlay = document.getElementById('overlay');
    overlay.style.top = yPos + 90 + 'px';
}

document.addEventListener('DOMContentLoaded', init, false);
document.addEventListener('unload', function () {}, false);
