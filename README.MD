# Image Cropper

Javascript lib that lets user crop images before upload.

## How To Use

Use as node module when building with npm:

	npm install lotcz/image-cropper

Include script in your page:

    <script src="image-cropper.js"></script>

Also include CSS style:

    <link rel="stylesheet" src="image-cropper.css" />

And now activate it inside the page:

    imageCropperListen(
		document.getElementById('article_image_form_group'),
		document.querySelector('#article_image_form_group input[type=file]'),
		document.querySelector('#article_image_form_group img')
	);
