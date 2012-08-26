var Project = function () { this.init.apply(this, arguments); };

Project.prototype = new (function () {
    
    // this.prototype = {}; inheritance

    this.init = function (element) {
        this.delegate = null;
        this.element = element;
        element.item = this;
        this.overlay = new Overlay(this.element.getAttribute('id'));
        
        var image = document.createElement('img');
        image.src = element.getAttribute('data-image');
        image.classList.add('project-image');
        element.appendChild(image);

        drawShadow(element);

        image.addEventListener('click', this.clickIcon.bind(this), false);
        window.addEventListener('3Dscroll', this.scroll.bind(this), false);
    };

    this.clickIcon = function (event) {
        event.stopPropagation();
        this.select();
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
        var position = this.element.offsetLeft - scrollPosition + 250;
        var parallax = position / window.innerWidth;
        position += parallax * 200;

        if (position + 350 > window.innerWidth) {
            position = this.element.offsetLeft - scrollPosition - 420;
            var parallax = position / window.innerWidth;
            position += parallax * 200;
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

})();
