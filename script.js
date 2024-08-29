document.getElementById('imageInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const image = document.getElementById('image');
        image.src = URL.createObjectURL(file);
        image.onload = function () {
            const frame = new Image();
            frame.src = 'assets/moldura.png'; // Caminho para a moldura
            frame.onload = function () {
                const cropper = new Cropper(image, {
                    aspectRatio: 1,
                    viewMode: 1,
                    ready: function () {
                        const canvas = document.getElementById('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = frame.width;
                        canvas.height = frame.height;

                        document.getElementById('cropButton').addEventListener('click', function () {
                            const croppedCanvas = cropper.getCroppedCanvas({
                                width: frame.width - 100,
                                height: frame.height - 100
                            });
                            const croppedImage = new Image();
                            croppedImage.src = croppedCanvas.toDataURL();
                            croppedImage.onload = function () {

                                ctx.save();
                                ctx.beginPath();
                                ctx.arc(frame.width / 2, frame.height / 2, (frame.width - 100) / 2, 0, 2 * Math.PI);
                                ctx.closePath();
                                ctx.clip();


                                ctx.drawImage(croppedImage, 50, 50, frame.width - 100, frame.height - 100);


                                ctx.restore();
                                ctx.drawImage(frame, 0, 0, frame.width, frame.height);

                                const resultImage = document.getElementById('resultImage');
                                resultImage.src = canvas.toDataURL('image/png');
                                resultImage.style.display = 'block';
                            };
                        });
                    }
                });
            };
        };
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const customButton = document.getElementById('customButton');
    const imageInput = document.getElementById('imageInput');
    const cropButton = document.getElementById('cropButton');
    const resultModal = document.getElementById('resultModal');
    const closeModal = document.querySelector('.close');
    const resultImage = document.getElementById('resultImage');
    const downloadButton = document.getElementById('downloadButton');
    const canvas = document.getElementById('canvas');
    const cropContainer = document.getElementById('cropContainer');
    const image = document.getElementById('image');
    const exemploImage = document.getElementById('exemplo');

    customButton.addEventListener('click', function () {
        imageInput.click();
    });

    imageInput.addEventListener('change', function () {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                image.src = e.target.result;
                cropButton.style.display = 'block';
                customButton.style.display = 'none';
                exemploImage.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    cropButton.addEventListener('click', function () {
        const croppedImageDataURL = canvas.toDataURL('image/png');
        resultImage.src = croppedImageDataURL;
        downloadButton.href = croppedImageDataURL;
        downloadButton.download = 'imagem-cortada.png';
        resultModal.style.display = 'block';
        cropContainer.style.display = 'none';
        cropButton.style.display = 'none';
        customButton.style.display = 'block';
    });

    closeModal.addEventListener('click', function () {
        resultModal.style.display = 'none';
        location.reload();
    });

    window.addEventListener('click', function (event) {
        if (event.target === resultModal) {
            resultModal.style.display = 'none';
            location.reload();
        }
    });
});