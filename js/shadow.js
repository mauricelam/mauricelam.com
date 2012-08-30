function drawShadow (project) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('version', '1.2');
    svg.setAttribute('width', '300');
    svg.setAttribute('height', '300');
    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    var filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute('id', 'gaussian_blur');
    var feGaussian = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
    feGaussian.setAttribute('in', 'SourceAlpha');
    feGaussian.setAttribute('stdDeviation', '2');
    filter.appendChild(feGaussian);
    defs.appendChild(filter);
    svg.appendChild(defs);

    var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', project.getAttribute('data-image'));
    image.setAttribute('width', '300');
    image.setAttribute('height', '300');
    image.setAttribute('style', 'filter:url(#gaussian_blur)');
    svg.appendChild(image);

    var shadowContainer = document.createElement('div');
    shadowContainer.appendChild(svg);
    shadowContainer.classList.add('project-image-shadow');
    project.appendChild(shadowContainer);
}
