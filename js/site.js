//=> compatibility Utils ScrollRecognizer ProjectController UrlBar CompatibilityCheck Modernizr

var WIDTH = 0;
var MAXSCROLL = 1500;
var MINSCROLL = 0;
// var ROTATEFACTOR = 0.005;

var scrollPosition = 0;
var controller = null;
var splashState = 0; // 0 - not splashed, 1 - splashing, 2 - splashed

function internalScrollTo(position, animated, duration, changescroll) {
    if (splashState === 0) {
        // Don't scroll yet if the splash is not finished
        return;
    }
    scrollPosition = Math.round(position);
    // var angle = -Math.atan((position + (window.innerWidth / 2) - (WIDTH / 2)) / 800);
    // var rotation = angle * ROTATEFACTOR;
    var tabletop = document.getElementById('tabletop');

    if (duration === undefined) {
        duration = 0.35;
    }

    tabletop.style.p.transition = (animated) ? '--transform ' + duration + 's' : 'none';
    //tabletop.style.p.transform = 'rotateX(10deg) rotateY('+ -rotation +'rad) rotateZ(' + rotation + 'rad) translateX('+ (-scrollPosition) +'px)';
    tabletop.style.p.transform = 'rotateX(10deg) translateX(' + (-scrollPosition) + 'px)';

    var nameplate = document.getElementById('nameplate');
    var nameplateWidth = parseInt(window.getComputedStyle(nameplate).width, 10);
    var addPercent = (-scrollPosition + (WIDTH / 2) - nameplateWidth) / 3;

    nameplate.style.p.transition = (animated) ? 'background-position ' + duration + 's' : 'none';
    nameplate.style.backgroundPosition = -addPercent + 'px 0';

    var scrollEvent = document.createEvent('CustomEvent');
    scrollEvent.initCustomEvent('3Dscroll', true, true, { animated: animated });
    tabletop.dispatchEvent(scrollEvent);
    if (changescroll) {
        if (animated && duration > 0) {
            tabletop.JP.listenOnce(Modernizr.transitionEnd, scrollTo.bind(window, position, 0));
        } else {
            window.scrollTo(position, 0);
        }
    }
}

function scrollTableTo (position, animated, duration) {
    // position = Math.max(Math.min(position, MAXSCROLL), MINSCROLL);
    internalScrollTo(position, animated, duration, true);
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
    overlay.style.top = (yPos + 55) + 'px';

    MAXSCROLL = WIDTH - window.innerWidth;
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

function startSplash() {
    resize();
    var wrap = document.getElementById('wrap');
    wrap.style.p.transition = 'opacity 1s';
    wrap.style.opacity = 1;
    splashState = 1;
    var splashPos = document.body.scrollLeft || document.documentElement.scrollLeft || (MAXSCROLL - MINSCROLL)/2;
    scrollTableTo(splashPos, true, 2);
    document.getElementById('tabletop').JP.listenOnce(Modernizr.transitionEnd, function () {
        splashState = 2;
    });
}

var scrollRecognizer = null;

function setMessage(message, header) {
    var contentBox = document.querySelector('#message > .content');
    var headerBox = document.querySelector('#message > .heading');

    if (message !== undefined) {
        contentBox.innerHTML = message;
        document.getElementById('wrap').style.display = 'none';
    }
    if (header !== undefined) headerBox.innerHTML = header;

    if (message === null) {
        document.getElementById('message').style.display = 'none';
        document.getElementById('wrap').style.display = 'block';
    }
}

function init(event) {
    var compatibility = CompatibilityCheck.getStatus();
    if (compatibility !== null) {
        setMessage('This site requires ' + compatibility + ', but your browser does not support it. ', '=(');
        return;
    }
    setMessage(null);

    WIDTH = document.getElementById('tabletop').getSize().width;

    document.getElementById('robots').style.width = WIDTH + 'px';
    document.addEventListener('touchstart', function () {
        document.getElementById('robots').style.width = '0';
    }, false);

    // Set initial transform for tabletop
    var translation = (WIDTH - window.innerWidth) / 2;
    var tabletop = document.getElementById('tabletop');
    tabletop.style.p.transform = 'rotateX(50deg) translateY(-300px) translateX(-' + translation + 'px) scale(0.5)';

    // create project controller
    controller = new ProjectController();

    // set up viewports for mobile and desktop
    var meta = document.getElementById('meta-viewport');
    if (screen.width < 500 || screen.height < 500) {
        meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=no');
    } else {
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    scrollRecognizer = new ScrollRecognizer(scrollDelta, internalScrollTo);
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

document.addEventListener('DOMContentLoaded', init, false);
document.addEventListener('unload', function () {}, false); // prevent page cache
