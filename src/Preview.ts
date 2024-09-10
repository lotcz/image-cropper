import DomBuilder from "./DomBuilder";
import ImgProps from "./ImgProps";
import Box from "./Box";

export default class Preview {

	wrapper: DomBuilder;

	imgProps: ImgProps;

	img: HTMLImageElement;

	canvas: HTMLCanvasElement;

	context2d: CanvasRenderingContext2D;

	box: Box;

	constructor(parent: any, imgProps: ImgProps) {
		this.wrapper = DomBuilder.of('div').parent(parent).css('cropper-editor');
		this.imgProps = imgProps;
		this.img = <HTMLImageElement>DomBuilder.of('img').parent(this.wrapper).css('visually-hidden').build();
		this.canvas = <HTMLCanvasElement>DomBuilder.of('canvas').parent(this.wrapper).build();
		this.context2d = this.canvas.getContext('2d');

		this.box = new Box(this.wrapper);

		this.img.addEventListener(
			'load',
			() => this.imgProps.setOriginalSize(
				this.img.naturalWidth,
				this.img.naturalHeight
			)
		);
		this.img.src = this.imgProps.src;

		this.imgProps.addChangedEventListener(() => this.render());
	}

	render() {
		this.context2d.clearRect(0, 0, this.imgProps.canvasWidth, this.imgProps.canvasHeight);
		this.context2d.drawImage(
			this.img,
			0,
			0,
			this.imgProps.originalWidth,
			this.imgProps.originalHeight,
			0,
			0,
			this.imgProps.originalWidth * this.imgProps.zoom,
			this.imgProps.originalHeight * this.imgProps.zoom
		);
	}
}
