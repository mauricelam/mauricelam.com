var Overlay = function () { this.init.apply(this, arguments); };

(function () {

    var self = Overlay.prototype = {};

    self.init = function (id) {
        if (!Overlay.sharedElement) {
            Overlay.sharedElement = document.getElementById('overlay');
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
        var content = JSON.parse(xhr.responseText);
        this.content = '<div class="name">' + content.name + '</div>' + '<div class="description">' + content.description + '</div>';
        this.displayContent();
    };

    self.hide = function () {
        this.visible = false;
        var overlay = Overlay.sharedElement;
        overlay.classList.add('hidden');
    };

    self.displayContent = function () {
        if (this.visible) {
            Overlay.sharedElement.innerHTML = this.content;
        }
    };

})();
