var TypeLabel = function () { this.init.apply(this, arguments); };

TypeLabel.prototype = new (function () {

    TypeLabel.TYPE_SAFARI_EXTENSION = 'safariextension';
    TypeLabel.TYPE_CHROME_EXTENSION = 'chromeextension';
    TypeLabel.TYPE_ANDROID_APP = 'androidapp';
    TypeLabel.TYPE_CONCEPT = 'concept';
    TypeLabel.TYPE_WEB_APP = 'webapp';

    TypeLabel.TYPE_RESEARCH = 'research';
    TypeLabel.TYPE_STARTUP = 'startup';
    TypeLabel.TYPE_INTERN = 'intern';

    var labels = {}
    labels[TypeLabel.TYPE_SAFARI_EXTENSION] = 'Safari Extension';
    labels[TypeLabel.TYPE_CHROME_EXTENSION] = 'Chrome Extension';
    labels[TypeLabel.TYPE_ANDROID_APP] = 'Android App';
    labels[TypeLabel.TYPE_CONCEPT] = 'Concept';
    labels[TypeLabel.TYPE_WEB_APP] = 'Web App';

    labels[TypeLabel.TYPE_RESEARCH] = 'Research';
    labels[TypeLabel.TYPE_STARTUP] = 'Startup';
    labels[TypeLabel.TYPE_INTERN] = 'Intern';

    this.init = function (type, link) {
        this.element = document.createElement('a');
        this.element.classList.add('typelabel');
        this.element.classList.add(type);
        if (link) {
            this.element.classList.add('active');
            this.element.href = link;
            this.element.target = "_blank";
        }

        var span = document.createElement('span');
        this.element.appendChild(span);

        span.innerHTML = labels[type];
    };

})();
