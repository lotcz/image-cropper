type Func = { (): void; }

export default class ImgProps {

	src: any;

	zoom: number;

	canvasWidth: number;

	canvasHeight: number;

	originalWidth: number;

	originalHeight: number;

	dragStartX: number;

	dragStartY: number;

	x: number;

	y: number;

	width: number;

	height: number;

	offsetX: number;

	offsetY: number;

	dragging: boolean;

	selecting: boolean;

	handlers: Func[] = [];

	addChangedEventListener(handler: Func) {
		this.handlers.push(handler);
	}

	propsChanged() {
		this.handlers.forEach((h) => h());
	}

	setZoom(zoom: number) {
		this.zoom = zoom;
		this.propsChanged();
	}

	setOriginalSize(width: number, height: number) {
		this.originalWidth = width;
		this.originalHeight = height;
		this.propsChanged();
	}

	setOffset(x: number, y: number) {
		this.offsetX = x;
		this.offsetY = y;
		this.propsChanged();
	}

	setCanvasSize(x: number, y: number) {
		this.canvasWidth = x;
		this.canvasHeight = y;
		this.propsChanged();
	}

	setBox(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.propsChanged();
	}
}
