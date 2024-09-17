import DomBuilder from "./DomBuilder";
import ImgProps from "./ImgProps";
import Box from "./Box";
import EditorComponent from "./EditorComponent";
import Vector2 from "./Vector2";

export default class Preview extends EditorComponent {

	wrapper: DomBuilder;

	img: HTMLImageElement;

	canvas: HTMLCanvasElement;

	context2d: CanvasRenderingContext2D;

	box: Box;

	constructor(parent: any, imgProps: ImgProps) {
		super(parent, imgProps);
		this.wrapper = DomBuilder.of('div').parent(parent).css('image-cropper-preview');
		this.img = <HTMLImageElement>DomBuilder.of('img').parent(this.wrapper).css('visually-hidden').build();
		this.canvas = <HTMLCanvasElement>DomBuilder.of('canvas').css('preview-canvas').parent(this.wrapper).build();
		this.context2d = this.canvas.getContext('2d');

		this.box = new Box(this.wrapper, imgProps);

		this.img.addEventListener(
			'load',
			() => this.imgProps.setOriginalSize(
				this.img.naturalWidth,
				this.img.naturalHeight
			)
		);
		this.img.src = this.imgProps.src;

		this.imgProps.addChangedListener(() => this.render());
		this.imgProps.addEventListener('crop', () => this.crop());
	}

	render() {
		DomBuilder.of(this.canvas)
			.attr('width', `${this.imgProps.canvasWidth}px`)
			.attr('height', `${this.imgProps.canvasHeight}px`);

		const actualWidth = this.imgProps.originalWidth * this.imgProps.zoom;
		const actualHeight = this.imgProps.originalHeight * this.imgProps.zoom;

		const diffX = (this.imgProps.canvasWidth - actualWidth) / 2;
		const diffY = (this.imgProps.canvasHeight - actualHeight) / 2;

		this.context2d.clearRect(0, 0, this.imgProps.canvasWidth, this.imgProps.canvasHeight);
		this.context2d.drawImage(
			this.img,
			diffX > 0 ? 0 : -diffX / this.imgProps.zoom,
			diffY > 0 ? 0 : -diffY / this.imgProps.zoom,
			diffX > 0 ? this.imgProps.originalWidth : this.imgProps.canvasWidth / this.imgProps.zoom,
			diffY > 0 ? this.imgProps.originalHeight : this.imgProps.canvasHeight / this.imgProps.zoom,
			diffX > 0 ? diffX : 0,
			diffY > 0 ? diffY : 0,
			diffX > 0 ? actualWidth : this.imgProps.canvasWidth,
			diffY > 0 ? actualHeight : this.imgProps.canvasHeight
		);

	}

	crop() {

		const canvasSize = new Vector2(this.imgProps.canvasWidth, this.imgProps.canvasHeight);
		const actualSize = new Vector2(this.imgProps.originalWidth, this.imgProps.originalHeight).multiply(this.imgProps.zoom);
		const imageCorner = canvasSize.sub(actualSize).multiply(0.5);
		const boxCorner = new Vector2(this.imgProps.boxStartX, this.imgProps.boxStartY);
		const boxSize = new Vector2(this.imgProps.boxWidth, this.imgProps.boxHeight);

		const cropCorner = boxCorner.sub(imageCorner).multiply(1/this.imgProps.zoom);
		const cropSize = boxSize.multiply(1/this.imgProps.zoom);

		const canvas = <HTMLCanvasElement>DomBuilder.of('canvas')
			.parent(this.wrapper)
			.css('visually-hidden')
			.attr('width', `${Math.abs(cropSize.x)}px`)
			.attr('height', `${Math.abs(cropSize.y)}px`)
			.build();
		const context2d = canvas.getContext('2d');
		context2d.drawImage(
			this.img,
			cropCorner.x,
			cropCorner.y,
			cropSize.x,
			cropSize.y,
			0,
			0,
			cropSize.x,
			cropSize.y
		);
		canvas.toBlob(
			(blob: Blob | null) => {
				if (blob === null) console.error('Cropped blob is null');
				this.imgProps.triggerEvent('cropped', blob);
				this.imgProps.triggerEvent('close');
			},
			"image/jpeg",
			0.9
		);

	}
}
