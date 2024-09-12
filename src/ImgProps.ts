export type EventHandler = { (arg?: any): void; }
export type EventHandlers = Array<EventHandler>;
export type EventHandlersCache = Map<string, EventHandlers>;

export default class ImgProps {

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

	handlers: EventHandlersCache = new Map<string, EventHandlers>();

	addEventListener(event: string, handler: EventHandler) {
		if (!this.handlers.has(event)) this.handlers.set(event, []);
		this.handlers.get(event).push(handler);
	}

	triggerEvent(event: string, arg?: any) {
		if (!this.handlers.has(event)) return;
		this.handlers.get(event).forEach((h: EventHandler) => h(arg));
	}

	addChangedEventListener(handler: EventHandler) {
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
		this.boxStartX = x;
		this.boxStartY = y;
		this.boxWidth = width;
		this.boxHeight = height;
		this.propsChanged();
	}
}
