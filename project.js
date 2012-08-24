var Project = function () { this.init.apply(this, arguments); };

(function () {

    var self = Project.prototype = {};

    self.init = function (element) {
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
    };

    self.clickIcon = function (event) {
        event.stopPropagation();
        this.select();
    };

    self.select = function () {
        if (!this.isSelected()) {
            this.element.classList.add('selected');
            setTimeout(function () { this.overlay.show() }.bind(this), 500);

            if (this.delegate && typeof this.delegate.projectDidSelect) {
                this.delegate.projectDidSelect(this);
            }
        }
    }

    self.deselect = function () {
        if (this.isSelected()) {
            this.element.classList.remove('selected');
            setTimeout(function () { this.overlay.hide() }.bind(this), 100);
            if (this.delegate && typeof this.delegate.projectDidDeselect) {
                this.delegate.projectDidDeselect(this);
            }
        }
    }

    self.isSelected = function () {
        return this.element.classList.contains('selected');
    };

})();
