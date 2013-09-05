var TypeLabel = function () { this.init.apply(this, arguments); };

TypeLabel.prototype = {

    LABELS: {
        'safariextension': 'Safari Extension',
        'chromeextension': 'Chrome Extension',
        'androidapp':      'Android App',
        'concept':         'Concept',
        'webapp':          'Web App',
        'research':        'Research',
        'intern':          'Intern',
        'github':          'GitHub',
        'link':            'Link'
    },

    init: function (type, link) {
        this.element = document.createElement('a');
        this.element.classList.add('typelabel');
        this.element.classList.add(type);
        if (link) {
            this.element.classList.add('active');
            this.element.href = link;
            this.element.target = '_blank';
        }

        var span = document.createElement('span');
        this.element.appendChild(span);
    }

};
