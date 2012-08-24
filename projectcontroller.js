var ProjectController = function () { this.init.apply(this, arguments); };

(function () {

    var self = ProjectController.prototype = {};

    self.init = function () {
        this.projects = [];
        this.selectedProject = null;

        document.addEventListener('click', this.clickTable.bind(this), false);
        window.addEventListener('resize', this.deselectProject.bind(this), false);

        var projectElements = document.querySelectorAll('.project');
        for (var i = 0, count = projectElements.length; i < count; i++) {
            var newProject = new Project(projectElements[i]);
            newProject.delegate = this;
            this.projects.push(newProject);
        }
    };

    self.deselectProject = function () {
        if (this.selectedProject) {
            this.selectedProject.deselect();
        }
    };

    self.projectDidDeselect = function (project) {
        document.getElementById('tabletop').classList.remove('blurred');
        this.selectedProject = null;
    };

    self.projectDidSelect = function (project) {
        var position = project.element.offsetLeft - window.innerWidth/2 + 300;
        scrollTo(position, true);

        document.getElementById('tabletop').classList.add('blurred');
        this.selectedProject = project;
    };

    self.clickTable = function (event) {
        this.deselectProject();
    };

})();
