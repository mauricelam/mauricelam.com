//=> Project

var ProjectController = function () { this.init.apply(this, arguments); };

ProjectController.prototype = new (function () {

    this.init = function () {
        this.projects = [];
        this.selectedProject = null;

        if ("ontouchstart" in window) {
            document.addEventListener('touchend', this.clickTable.bind(this), false);
        } else {
            document.addEventListener('click', this.clickTable.bind(this), false);
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

        for (var i=0, count=this.projects.length; i < count; i++) {
            if (this.projects[i] != this.selectedProject) {
                this.projects[i].unblur();
            }
        }
    };

    this.projectDidSelect = function (project) {
        this.deselectProject();
        var position = project.element.offsetLeft - window.innerWidth/2 + 300;
        if (position - WIDTH + window.innerWidth > 100) {
            position -= 300;
        }
        scrollTableTo(position, true);

        document.getElementById('tabletop').classList.add('blurred');
        this.selectedProject = project;

        for (var i=0, count=this.projects.length; i < count; i++) {
            if (this.projects[i] != project) {
                this.projects[i].blur();
            }
        }
    };

    this.windowResized = function (event) {
        if (this.selectedProject == null) {
            return;
        }
        var position = this.selectedProject.element.offsetLeft - window.innerWidth/2 + 300;
        if (position - WIDTH + window.innerWidth > 100) {
            position -= 300;
        }
        scrollTableTo(position, false);
    };

    this.clickTable = function (event) {
        if (event.type == 'click' || Math.abs(event.lastEvent.pageX - event.startEvent.pageX) < 44) {
            this.deselectProject();
        }
    };

})();
