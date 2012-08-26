var Overlay = function () { this.init.apply(this, arguments); };

(function () {

    var self = Overlay.prototype = {};

    self.init = function (id) {
        if (!Overlay.sharedElement) {
            Overlay.sharedElement = document.getElementById('overlay');
            Overlay.sharedElement.addEventListener('click', Overlay.click, false);
        }
        this.id = id;
        this.content = null;
        this.visible = false;
    };

    self.show = function () {
        this.visible = true;
        var overlay = Overlay.sharedElement;
        overlay.innerHTML = '';
        overlay.classList.remove('hidden');
        
        if (!this.content) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'projects/' + this.id + '.json', true);
            xhr.send();
            xhr.addEventListener('load', this.contentLoaded.bind(this), false);
        } else {
            this.displayContent();
        }
    };

    self.contentLoaded = function (event) {
        var xhr = event.target;
        this.content = JSON.parse(xhr.responseText);
        this.displayContent();
    };

    self.createOverlayHTML = function () {
        return html;
    }

    self.hide = function () {
        this.visible = false;
        var overlay = Overlay.sharedElement;
        overlay.classList.add('hidden');
    };

    self.displayContent = function () {
        if (this.visible) {
            Overlay.sharedElement.innerHTML = '';

            var nameTag = document.createElement('div');
            nameTag.classList.add('name');
            nameTag.innerHTML = this.content.name;
            Overlay.sharedElement.appendChild(nameTag);

            var divider = document.createElement('div');
            divider.classList.add('divider');
            Overlay.sharedElement.appendChild(divider);

            var types = this.content.types;
            if (types) {
                for (var i=0, count=types.length; i < count; i++) {
                    var label = new TypeLabel(types[i]);
                    Overlay.sharedElement.appendChild(label.element);
                }
            }

            var description = document.createElement('div');
            description.classList.add('description');
            description.innerHTML = this.content.description;
            Overlay.sharedElement.appendChild(description);
        }
    };

    Overlay.click = function (event) {
        event.stopPropagation();
    };

})();
