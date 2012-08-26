var ProjectController = function () { this.init.apply(this, arguments); };

ProjectController.prototype = new (function () {

    this.init = function () {
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

    this.deselectProject = function () {
        if (this.selectedProject) {
            this.selectedProject.deselect();
        }
    };

    this.projectDidDeselect = function (project) {
        document.getElementById('tabletop').classList.remove('blurred');
        this.selectedProject = null;
    };

    this.projectDidSelect = function (project) {
        this.deselectProject();
        var position = project.element.offsetLeft - window.innerWidth/2 + 300;
        scrollTo(position, true);

        document.getElementById('tabletop').classList.add('blurred');
        this.selectedProject = project;
    };

    this.clickTable = function (event) {
        this.deselectProject();
    };

})();
