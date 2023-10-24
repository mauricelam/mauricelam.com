//=> JP TapEvent Project Modernizr

var ProjectController = function () { JP.object(this, arguments); };

ProjectController.prototype = {

    init: function () {
        this.projects = [];
        this.selectedProject = null;

        document.JP.listen('tap/click', this.$clickTable);
        window.addEventListener('resize', this.windowResized.bind(this), false);

        var projectElements = document.querySelectorAll('.project');

        for (var i = 0, count = projectElements.length; i < count; i++) {
            var newProject = new Project(projectElements[i]);
            newProject.delegate = this;
            this.projects.push(newProject);
        }
    },

    deselectProject: function () {
        if (this.selectedProject) {
            this.selectedProject.deselect();
        }
    },

    projectDidDeselect: function (project) {
        document.getElementById('tabletop').classList.remove('blurred');
        this.selectedProject = null;

        this.projects.forEach(function (otherProject) {
            if (otherProject != project) {
                otherProject.unblur();
            }
        });
    },

    projectDidSelect: function (project) {
        this.deselectProject();
        var position = project.element.offsetLeft - window.innerWidth/2 + 250;
        scrollTableTo(position, true);

        document.getElementById('tabletop').classList.add('blurred');
        this.selectedProject = project;

        this.projects.forEach(function (otherProject) {
            if (otherProject != project) {
                otherProject.blur();
            }
        });
    },

    windowResized: function (event) {
        if (!this.selectedProject) {
            return;
        }
        var position = this.selectedProject.element.offsetLeft - window.innerWidth/2 + 250;
        scrollTableTo(position, false);
    },

    clickTable: function (event) {
        this.deselectProject();
    }

};
