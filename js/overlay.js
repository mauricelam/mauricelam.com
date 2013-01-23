//=> TypeLabel TapGestureRecognizer Modernizr

var Overlay = function Overlay () { this.init.apply(this, arguments); };

Overlay.prototype = new (function () {

    this.init = function (id) {
        this.$('click');

        if (!Overlay.sharedElement) {
            var overlay = Overlay.sharedElement = document.getElementById('overlay');
            overlay.style.p.transition = '--transform 0.3s, opacity 0.3s';
            if (Modernizr.touch) {
                overlay.addEventListener('tap', this.$click, false);
            } else {
                overlay.addEventListener('click', this.$click, false);
            }
            overlay.content = overlay.querySelector('.content');
            overlay.leftArrow = overlay.querySelector('.leftarrow');
            overlay.rightArrow = overlay.querySelector('.rightarrow');
        }
        this.id = id;
        this.content = null;
        this.visible = false;
    };

    this.show = function () {
        this.visible = true;
        var overlay = Overlay.sharedElement;
        overlay.classList.remove('hidden');
        overlay.content.innerHTML = '';

        overlay.leftArrow.classList.add('hidden');
        overlay.rightArrow.classList.add('hidden');
        
        if (!this.content) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'projects/' + this.id + '.json', true);
            xhr.send();
            xhr.addEventListener('load', this.contentLoaded.bind(this), false);
        } else {
            this.displayContent();
        }
    };

    this.contentLoaded = function (event) {
        var xhr = event.target;
        this.content = JSON.parse(xhr.responseText);
        this.displayContent();
    };

    this.hide = function () {
        this.visible = false;
        var overlay = Overlay.sharedElement;
        overlay.classList.add('hidden');
    };

    this.displayContent = function () {
        if (this.visible) {
            var overlay = Overlay.sharedElement;
            overlay.content.innerHTML = '';

            var nameTag = document.createElement('div');
            nameTag.classList.add('name');
            nameTag.innerHTML = this.content.name;
            overlay.content.appendChild(nameTag);

            var divider = document.createElement('div');
            divider.classList.add('divider');
            overlay.content.appendChild(divider);

            var types = this.content.types;
            if (types) {
                for (var i in types) {
                    var label = new TypeLabel(i, types[i]);
                    overlay.content.appendChild(label.element);
                }
            }

            var description = document.createElement('div');
            description.classList.add('description');
            description.innerHTML = this.content.description;
            overlay.content.appendChild(description);

            if (this.content.info) {
                overlay.leftArrow.classList.remove('hidden');
                overlay.rightArrow.classList.remove('hidden');
            }
        }
    };

    this.setPosition = function (position) {
        this.position = position;
        Overlay.sharedElement.style.left = position + 'px';
    };

    this.click = function (event) {
        event.stopPropagation();
    };

})();
