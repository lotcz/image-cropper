import DomBuilder from "./core/DomBuilder";
import ImgProps from "./ImgProps";
import EditorComponent from "./core/EditorComponent";

export default class Box extends EditorComponent {

	wrapper: DomBuilder;

	canvas: HTMLCanvasElement;

	context2d: CanvasRenderingContext2D;

	constructor(parent: any, imgProps: ImgProps) {
		super(parent, imgProps);
		this.wrapper = DomBuilder.of('div').parent(parent).css('box');
		this.canvas = <HTMLCanvasElement>DomBuilder.of('canvas').css('box-canvas').parent(this.wrapper).build();
		this.context2d = this.canvas.getContext('2d');
		this.imgProps.addChangedListener(() => this.render());
	}

	render() {
		DomBuilder.of(this.canvas)
			.attr('width', `${this.imgProps.canvasSize.x}px`)
			.attr('height', `${this.imgProps.canvasSize.y}px`);

		this.context2d.clearRect(0, 0, this.imgProps.canvasSize.x, this.imgProps.canvasSize.y);

		if (this.imgProps.boxSize.size() === 0) return;

		this.context2d.fillStyle = 'rgba(0, 0, 0, 0.85)';
		this.context2d.fillRect(0, 0, this.imgProps.canvasSize.x, this.imgProps.canvasSize.y);
		this.context2d.clearRect(
			this.imgProps.boxStartSanitized.x,
			this.imgProps.boxStartSanitized.y,
			Math.abs(this.imgProps.boxSize.x),
			Math.abs(this.imgProps.boxSize.y)
		);
		this.context2d.fillStyle = 'rgba(255, 255, 255, 1)';
		this.context2d.strokeStyle = 'rgba(255, 255, 255, 1)';
		this.context2d.lineWidth = 1;
		this.context2d.strokeRect(
			this.imgProps.boxStartSanitized.x,
			this.imgProps.boxStartSanitized.y,
			Math.abs(this.imgProps.boxSize.x),
			Math.abs(this.imgProps.boxSize.y)
		);
	}
}
