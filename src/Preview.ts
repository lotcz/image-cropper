import DomBuilder from "./core/DomBuilder";
import ImgProps from "./ImgProps";
import Box from "./Box";
import EditorComponent from "./core/EditorComponent";
import Vector2 from "./core/Vector2";

export default class Preview extends EditorComponent {

	wrapper: DomBuilder;

	img: HTMLImageElement;

	canvas: HTMLCanvasElement;

	context2d: CanvasRenderingContext2D;

	box: Box;

	constructor(parent: any, imgProps: ImgProps) {
		super(parent, imgProps);
		this.wrapper = DomBuilder.of('div').parent(parent).css('preview');
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
			.attr('width', `${this.imgProps.canvasSize.x}px`)
			.attr('height', `${this.imgProps.canvasSize.y}px`);

		const actualWidth = this.imgProps.originalSize.x * this.imgProps.zoomImg;
		const actualHeight = this.imgProps.originalSize.y * this.imgProps.zoomImg;

		const diffX = (this.imgProps.canvasSize.x - actualWidth) / 2;
		const diffY = (this.imgProps.canvasSize.y - actualHeight) / 2;

		this.context2d.clearRect(0, 0, this.imgProps.canvasSize.x, this.imgProps.canvasSize.y);
		this.context2d.drawImage(
			this.img,
			diffX > 0 ? 0 : -diffX / this.imgProps.zoomImg,
			diffY > 0 ? 0 : -diffY / this.imgProps.zoomImg,
			diffX > 0 ? this.imgProps.originalSize.x : this.imgProps.canvasSize.x / this.imgProps.zoomImg,
			diffY > 0 ? this.imgProps.originalSize.y : this.imgProps.canvasSize.y / this.imgProps.zoomImg,
			diffX > 0 ? diffX : 0,
			diffY > 0 ? diffY : 0,
			diffX > 0 ? actualWidth : this.imgProps.canvasSize.x,
			diffY > 0 ? actualHeight : this.imgProps.canvasSize.y
		);

	}

	crop() {
		const canvasSize = this.imgProps.canvasSize.clone();
		const actualSize = this.imgProps.originalSize.multiply(this.imgProps.zoomImg);
		const imageCorner = canvasSize.sub(actualSize).multiply(0.5);
		const boxCorner = this.imgProps.boxStart.clone();
		const boxSize = this.imgProps.boxSize.clone();

		const cropCorner = boxCorner.sub(imageCorner).multiply(1/this.imgProps.zoomImg);
		const cropSize = boxSize.multiply(1/this.imgProps.zoomImg);

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
