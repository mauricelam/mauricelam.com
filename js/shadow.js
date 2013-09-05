var Shadow = {
    drawShadow: function (image, width, height) {
        var canvas = document.createElement('canvas');
        image.addEventListener('load', function () {
            canvas.style.width  = width + 'px';
            canvas.style.height = height + 'px';
            canvas.width = width;
            canvas.height = height;

            var context = canvas.getContext('2d');
            context.clearRect(0, 0, width, height);
            context.drawImage(image, 0, 0, width, height);

            // Make the image black
            context.globalAlpha = 1.0;
            context.globalCompositeOperation = 'source-atop';
            context.fillStyle = '#000';
            context.fillRect(0, 0, 300, 300);
            context.globalAlpha = 1.0;
            context.globalCompositeOperation = 'source-over';
        }, false);
        canvas.classList.add('project-image-shadow');
        return canvas;
    }
};
