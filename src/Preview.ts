import DomBuilder from "./DomBuilder";
import ImgProps from "./ImgProps";
import Box from "./Box";
import Component from "./Component";

export default class Preview extends Component {

	wrapper: DomBuilder;

	img: HTMLImageElement;

	canvas: HTMLCanvasElement;

	context2d: CanvasRenderingContext2D;

	box: Box;

	constructor(parent: any, imgProps: ImgProps) {
		super(parent, imgProps);
		this.wrapper = DomBuilder.of('div').parent(parent).css('image-cropper-preview');
		this.img = <HTMLImageElement>DomBuilder.of('img').parent(this.wrapper).css('visually-hidden').build();
		this.canvas = <HTMLCanvasElement>DomBuilder.of('canvas').parent(this.wrapper).build();
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

		this.imgProps.addChangedEventListener(() => this.render());
	}

	render() {
		DomBuilder.of(this.canvas).attr('width', `${this.imgProps.canvasWidth}px`);
		DomBuilder.of(this.canvas).attr('height', `${this.imgProps.canvasHeight}px`);

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
}
