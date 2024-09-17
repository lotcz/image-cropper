import LogicalComponent from "./LogicalComponent";

export default class ImgProps extends LogicalComponent {

	src: any;

	zoom: number = 1;

	canvasWidth: number;

	canvasHeight: number;

	originalWidth: number;

	originalHeight: number;

	dragStartX: number;

	dragStartY: number;

	boxStartX: number;

	boxStartY: number;

	boxWidth: number;

	boxHeight: number;

	offsetX: number;

	offsetY: number;

	dragging: boolean = false;

	selecting: boolean = false;

	setZoom(zoom: number) {
		this.zoom = zoom;
		this.triggerChangedEvent();
	}

	setOriginalSize(width: number, height: number) {
		this.originalWidth = width;
		this.originalHeight = height;
		this.triggerChangedEvent();
	}

	setOffset(x: number, y: number) {
		this.offsetX = x;
		this.offsetY = y;
		this.triggerChangedEvent();
	}

	setCanvasSize(x: number, y: number) {
		this.canvasWidth = x;
		this.canvasHeight = y;
		this.triggerChangedEvent();
	}

	setBox(x: number, y: number, width: number, height: number) {
		this.boxStartX = x;
		this.boxStartY = y;
		this.boxWidth = width;
		this.boxHeight = height;
		this.triggerChangedEvent();
	}
}
