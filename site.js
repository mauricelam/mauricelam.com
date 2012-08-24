var WIDTH = 4000;
var ROTATEFACTOR = 0.005;
var scrollPosition = 0;
var controller = null;

function scroll (event) {
    event.stopPropagation();
    event.preventDefault();
    var dx = event.wheelDeltaX;
    scrollTo(scrollPosition - dx/4);
}

function scrollTo (position, animated) {
    controller.deselectProject();

    position = Math.max(Math.min(position, WIDTH - window.innerWidth), 0);
    scrollPosition = position;
    var angle = -Math.atan((position + (window.innerWidth / 2) - (WIDTH / 2)) / 800);
    var rotation = angle * ROTATEFACTOR;
    var tabletop = document.getElementById('tabletop');

    if (animated) {
        tabletop.style.webkitTransition = '-webkit-transform 0.35s';
    } else {
        tabletop.style.webkitTransition = 'none';
    }
    
    tabletop.style.webkitTransform = 'rotateX(10deg) rotateY('+ -rotation +'rad) rotateZ(' + rotation + 'rad) translateX('+ (-scrollPosition) +'px)';

    var nameplate = document.getElementById('nameplate');
    var nameplateWidth = parseInt(window.getComputedStyle(nameplate).width);
    var addPercent = (-scrollPosition + WIDTH/2 - nameplateWidth ) / 3;

    if (animated) {
        nameplate.style.webkitTransition = '-webkit-filter 0.5s, background-position 0.35s';
    } else {
        nameplate.style.webkitTransition = '-webkit-filter 0.5s';
    }
    nameplate.style.backgroundPosition = -addPercent + 'px 0';

    var scrollEvent = document.createEvent("Event");
    scrollEvent.initEvent("3Dscroll", true, true);
    tabletop.dispatchEvent(scrollEvent);
}

function init (event) {
    controller = new ProjectController();

    scrollTo((WIDTH - window.innerWidth) / 2);
    document.addEventListener('mousewheel', scroll, false);
}

document.addEventListener('DOMContentLoaded', init, false);
