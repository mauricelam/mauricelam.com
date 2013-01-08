//=> Project Modernizr TapGestureRecognizer

var ProjectController = function () { this.init.apply(this, arguments); };

ProjectController.prototype = new (function () {

    this.init = function () {
        this.$('clickTable');

        this.projects = [];
        this.selectedProject = null;

        if (Modernizr.touch) {
            document.addEventListener('tap', this.$clickTable, false);
        } else {
            document.addEventListener('click', this.$clickTable, false);
        }
        window.addEventListener('resize', this.windowResized.bind(this), false);

        var projectElements = document.querySelectorAll('.project');

        for (var i = 0, count = projectElements.length; i < count; i++) {
            var newProject = new Project(projectElements[i]);
            newProject.delegate = this;
            this.projects.push(newProject);
        }
    };

    this.deselectProject = function () {
        if (this.selectedProject) {
            this.selectedProject.deselect();
        }
    };

    this.projectDidDeselect = function (project) {
        document.getElementById('tabletop').classList.remove('blurred');
        this.selectedProject = null;

        for (var i = 0, count = this.projects.length; i < count; i++) {
            if (this.projects[i] != this.selectedProject) {
                this.projects[i].unblur();
            }
        }
    };

    this.projectDidSelect = function (project) {
        this.deselectProject();
        var position = project.element.offsetLeft - window.innerWidth/2 + 250;
        scrollTableTo(position, true);

        document.getElementById('tabletop').classList.add('blurred');
        this.selectedProject = project;

        for (var i = 0, count = this.projects.length; i < count; i++) {
            if (this.projects[i] != project) {
                this.projects[i].blur();
            }
        }
    };

    this.windowResized = function (event) {
        if (!this.selectedProject) {
            return;
        }
        var position = project.element.offsetLeft - window.innerWidth/2 + 250;
        scrollTableTo(position, false);
    };

    this.clickTable = function (event) {
        this.deselectProject();
    };

})();
