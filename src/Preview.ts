import DomBuilder from "./core/DomBuilder";
import ImgProps from "./ImgProps";
import Box from "./Box";
import EditorComponent from "./core/EditorComponent";
import Vector2 from "./core/Vector2";
import {CropperResult} from "./CropperResult";

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
		this.img.src = this.imgProps.params.imgSrc;

		this.imgProps.addChangedListener(() => this.render());
		this.imgProps.addEventListener('crop', () => this.crop());
	}

	render() {
		DomBuilder.of(this.canvas)
			.attr('width', `${this.imgProps.canvasSize.x}px`)
			.attr('height', `${this.imgProps.canvasSize.y}px`);

		const sourceSize= this.imgProps.canvasSize.multiply(1/this.imgProps.zoomImg);
		const sourceStart= this.imgProps.originalSize.subtract(sourceSize).multiply(1/2).subtract(this.imgProps.offset);

		this.context2d.clearRect(0, 0, this.imgProps.canvasSize.x, this.imgProps.canvasSize.y);

		this.context2d.drawImage(
			this.img,
			sourceStart.x,
			sourceStart.y,
			sourceSize.x,
			sourceSize.y,
			0,
			0,
			this.imgProps.canvasSize.x,
			this.imgProps.canvasSize.y
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
			cropCorner.x - this.imgProps.offset.x,
			cropCorner.y - this.imgProps.offset.y,
			cropSize.x,
			cropSize.y,
			0,
			0,
			cropSize.x,
			cropSize.y
		);
		canvas.toBlob(
			(blob: Blob | null) => {
				if (blob === null) console.error('Cropped blob is null!');
				const result: CropperResult = {
					src: blob,
					originalSize: this.imgProps.originalSize,
					croppedSize: cropSize
				};
				this.imgProps.triggerEvent('cropped', result);
				this.imgProps.triggerEvent('close');
			},
			"image/jpeg",
			0.9
		);

	}
}
