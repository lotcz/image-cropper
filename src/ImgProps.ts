import LogicalComponent from "./core/LogicalComponent";
import Vector2 from "./core/Vector2";

export enum ImgMode {
	Crop,
	Resize
}

export default class ImgProps extends LogicalComponent {

	mode: ImgMode = ImgMode.Crop;

	src: any;

	zoomImg: number = 1;

	canvasSize: Vector2 = new Vector2();

	originalSize: Vector2 = new Vector2();

	boxSelecting: boolean = false;

	boxZoom: number = 1;

	boxStart: Vector2 = new Vector2();

	boxStartSanitized: Vector2 = new Vector2();

	boxSize: Vector2 = new Vector2();

	offset: Vector2 = new Vector2();

	dragging: boolean = false;

	dragStart: Vector2 = new Vector2();

	constructor() {
		super();
		this.addChild(this.canvasSize);
		this.addChild(this.originalSize);
		this.addChild(this.boxStart);
		this.addChild(this.boxStartSanitized);
		this.addChild(this.boxSize);
		this.addChild(this.offset);
		this.addChild(this.dragStart);

		const updateBoxHandler = () => this.updateBox();
		this.boxStart.addChangedListener(updateBoxHandler);
		this.boxSize.addChangedListener(updateBoxHandler);
	}

	setZoom(zoom: number) {
		this.zoomImg = zoom;
		this.triggerChangedEvent();
	}

	setOriginalSize(width: number, height: number) {
		this.originalSize.set(width, height);
	}

	setOffset(x: number, y: number) {
		this.offset.set(x, y);
	}

	setCanvasSize(x: number, y: number) {
		this.canvasSize.set(x, y);
	}

	updateBox() {
		this.boxStartSanitized.set(
			this.boxSize.x > 0 ? this.boxStart.x : this.boxStart.x + this.boxSize.x,
			this.boxSize.y > 0 ? this.boxStart.y : this.boxStart.y + this.boxSize.y
		);
	}
}
