//=> Overlay Utils Modernizr TapGestureRecognizer

var Project = function () { this.init.apply(this, arguments); };

Project.prototype = new (function () {

    this.init = function (element) {
        this.delegate = null;
        this.element = element;
        element.item = this;
        this.overlay = new Overlay(this.element.getAttribute('id'));

        var width = 300, height = 300;

        var image = new Image();
        image.src = element.getAttribute('data-image') + '.png';

        var imageCanvas = Utils.createImageCanvas(image, width, height);
        imageCanvas.originalImage = image;
        imageCanvas.classList.add('project-image');
        element.appendChild(imageCanvas);

        var shadowImage = new Image();
        shadowImage.src = element.getAttribute('data-image') + '_shadow.png';

        var shadowCanvas = Utils.createImageCanvas(shadowImage, width, height);
        shadowCanvas.classList.add('project-image-shadow');
        element.appendChild(shadowCanvas);

        if (Modernizr.touch) {
            var tapRecognizer = imageCanvas.addEventListener('tap', this.clickIcon.bind(this), false);
            tapRecognizer.stopsPropagation = true;
        } else {
            imageCanvas.addEventListener('click', this.clickIcon.bind(this), false);
        }
        window.addEventListener('3Dscroll', this.scroll.bind(this), false);
    };

    this.clickIcon = function (event) {
        event.stopPropagation();
        this.select();
    };

    this.select = function () {
        if (!this.isSelected()) {
            this.element.classList.add('selected');
            setTimeout(function () {
                if (this.isSelected()) {
                    var position = this.getOverlayPosition();

                    this.overlay.setPosition(position);
                    this.overlay.show();
                }
             }.bind(this), 500);

            if (this.delegate && typeof this.delegate.projectDidSelect === 'function') {
                this.delegate.projectDidSelect(this);
            }
        }
    };

    this.deselect = function () {
        if (this.isSelected()) {
            this.element.classList.remove('selected');
            setTimeout(this.overlay.$('hide'), 100);
            if (this.delegate && typeof this.delegate.projectDidDeselect) {
                this.delegate.projectDidDeselect(this);
            }
        }
    };

    this.isSelected = function () {
        return this.element.classList.contains('selected');
    };

    this.getImagePosition = function () {
        var image = this.element.querySelector('.project-image');
        return Utils.convertPointFromNodeToPage(image).x + 350;
    };

    this.getOverlayPosition = function () {
        return Math.min(this.getImagePosition(), window.innerWidth - 350);
    };

    this.scroll = function (event) {
        if (this.overlay.visible) {
            var position = this.getOverlayPosition();
            this.overlay.setPosition(position);

            var imagePosition = this.getImagePosition();
            if (imagePosition < 20 || imagePosition > window.innerWidth + 30) {
                this.deselect();
            }
        }
    };

    this.blur = function () {
        // var canvas = this.element.querySelector('.project-image');
        // var context = canvas.getContext('2d');
        // context.globalAlpha = 0.1;
        // context.globalCompositeOperation = 'source-atop';
        // context.fillStyle = '#FFF';
        // this.whitenAnimation(canvas, context, 10);
    };

    this.whitenAnimation = function (canvas, context, times) {
        // if (times == 0) {
        //     // revert back to default global canvas operations
        //     context.globalAlpha = 1.0;
        //     context.globalCompositeOperation = 'source-over';
        // } else {
        //     context.fillRect(0, 0, 300, 300);
        //     setTimeout(function () { this.whitenAnimation(canvas, context, times - 1); }.bind(this), 30);
        // }
    };

    this.unblur = function () {
        // var width = 300, height = 300;
        // var canvas = this.element.querySelector('.project-image');
        // var context = canvas.getContext('2d');
        // context.clearRect(0, 0, width, height);
        // context.drawImage(canvas.originalImage, 0, 0, width, height);
    };

})();
