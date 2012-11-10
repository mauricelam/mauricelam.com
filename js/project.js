//=> Overlay Shadow

var Project = function () { this.init.apply(this, arguments); };

Project.prototype = new (function () {

    this.init = function (element) {
        this.delegate = null;
        this.element = element;
        element.item = this;
        this.overlay = new Overlay(this.element.getAttribute('id'));
        
        var image = new Image();
        image.src = element.getAttribute('data-image');

        var width = 300, height = 300;

        var imageCanvas = document.createElement('canvas');
        imageCanvas.originalImage = image;
        imageCanvas.classList.add('project-image');
        image.addEventListener('load', function () {
            imageCanvas.style.width  = width + "px";
            imageCanvas.style.height = height + "px";
            imageCanvas.width = width;
            imageCanvas.height = height;
            
            var context = imageCanvas.getContext("2d");
            context.clearRect( 0, 0, width, height );
            context.drawImage( image, 0, 0, width, height );
        }, false);
        element.appendChild(imageCanvas);

        element.appendChild(drawShadow(image, width, height));

        if (isTouchDevice()) {
            imageCanvas.addEventListener('touchend', this.clickIcon.bind(this), false);
        } else {
            imageCanvas.addEventListener('click', this.clickIcon.bind(this), false);
        }
        window.addEventListener('3Dscroll', this.scroll.bind(this), false);
    };

    this.clickIcon = function (event) {
        if (event.type == 'click' || Math.abs(event.lastEvent.pageX - event.startEvent.pageX) < 44) {
            event.stopPropagation();
            this.select();
        }
    };

    this.select = function () {
        if (!this.isSelected()) {
            this.element.classList.add('selected');
            setTimeout(function () { this.overlay.show(); }.bind(this), 500);

            if (this.delegate && typeof this.delegate.projectDidSelect) {
                this.delegate.projectDidSelect(this);
            }
            this.setOverlayPosition();
        }
    }

    this.deselect = function () {
        if (this.isSelected()) {
            this.element.classList.remove('selected');
            setTimeout(function () { this.overlay.hide() }.bind(this), 100);
            if (this.delegate && typeof this.delegate.projectDidDeselect) {
                this.delegate.projectDidDeselect(this);
            }
        }
    }

    this.isSelected = function () {
        return this.element.classList.contains('selected');
    };

    this.setOverlayPosition = function () {
        var position = this.element.offsetLeft - scrollPosition;
        position *= 1.18;
        position += 280;

        if (position + 250 > window.innerWidth) {
            position -= 720;
        }
        Overlay.sharedElement.style.left = position + 'px';
    };

    this.scroll = function (event) {
        if (this.overlay.visible) {
            this.setOverlayPosition();
            var screenOffset = this.element.offsetLeft - scrollPosition;
            if (screenOffset < -50 || screenOffset > window.innerWidth - 200) {
                this.deselect();
            }
        }
    };

    this.blur = function () {
        var canvas = this.element.querySelector('.project-image');
        var context = canvas.getContext('2d');
        if (!canvas.restoreCache('blurred')) {
            //stackBlurImageWithSize(canvas.originalImage, canvas, 300, 300, 5, true);
            context.globalAlpha = 0.5;
            context.globalCompositeOperation = 'source-atop';
            context.fillStyle = "#FFF";
            context.fillRect(0, 0, 300, 300);
            context.globalAlpha = 1.0;
            context.globalCompositeOperation = 'source-over';

            canvas.saveCache('blurred');
        }
    };

    this.unblur = function () {
        var width = 300, height = 300;
        var canvas = this.element.querySelector('.project-image');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, width, height);
        context.drawImage(canvas.originalImage, 0, 0, width, height);
    }

})();
