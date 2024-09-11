type Func = { (): void; }
type FuncHandlers = Array<Func>;
type FuncHandlersCache = Map<string, FuncHandlers>;

export default class ImgProps {

	src: any;

	zoom: number = 1;

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

	dragging: boolean = false;

	selecting: boolean = false;

	handlers: FuncHandlersCache = new Map<string, FuncHandlers>();

	addEventListener(event: string, handler: Func) {
		if (!this.handlers.has(event)) this.handlers.set(event, []);
		this.handlers.get(event).push(handler);
	}

	triggerEvent(event: string) {
		if (!this.handlers.has(event)) return;
		this.handlers.get(event).forEach((h: Func) => h());
	}

	addChangedEventListener(handler: Func) {
		this.addEventListener('change', handler);
	}

	propsChanged() {
		this.triggerEvent('change');
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
