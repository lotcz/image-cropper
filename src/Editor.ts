import DomBuilder from "./DomBuilder";
import Preview from "./Preview";
import Toolbar from "./Toolbar";
import EventUtil from "./EventUtil";
import ImgProps from "./ImgProps";
import EditorComponent from "./EditorComponent";
import {EventHandler} from "./LogicalComponent";

export default class Editor extends EditorComponent {

	wrapper: DomBuilder;

	preview: Preview;

	toolbar: Toolbar;

	initialized: boolean = false;

	constructor(parent: any, src: any) {
		super(parent, new ImgProps());
		this.imgProps.src = src;
		this.wrapper = DomBuilder.of('div')
			.parent(parent)
			.css("image-cropper-editor");

		this.preview = new Preview(this.wrapper, this.imgProps);
		this.toolbar = new Toolbar(this.wrapper, this.imgProps);

		this.wrapper.addEventListener('wheel', (e: WheelEvent) => {
			EventUtil.stop(e);
			const k = e.deltaY > 0 ? 0.9 : 1.1;
			this.imgProps.setZoom(this.imgProps.zoom * k);
		});

		this.wrapper.addEventListener('mousedown', (e: MouseEvent) => {
			EventUtil.stop(e);
			if (e.button === 0) {
				if (!this.imgProps.selecting) {
					this.imgProps.setBox(e.clientX, e.clientY, 0, 0);
				}
				this.imgProps.selecting = true;
			}
			if (e.button === 2) {
				if (!this.imgProps.dragging) {
					this.imgProps.dragStartX = e.clientX;
					this.imgProps.dragStartY = e.clientY;
				}
				this.imgProps.dragging = true;
			}
		});

		this.wrapper.addEventListener('mouseup', (e: MouseEvent) => {
			EventUtil.stop(e);
			if (e.button === 0) {
				this.imgProps.selecting = false;
			}
			if (e.button === 2) {
				this.imgProps.dragging = false;
			}
		});

		this.wrapper.addEventListener('mousemove', (e: MouseEvent) => {
			if (this.imgProps.dragging) {
				this.imgProps.setOffset(
					this.imgProps.offsetX + (e.clientX - this.imgProps.dragStartX),
					this.imgProps.offsetY + (e.clientY - this.imgProps.dragStartY)
				);
				this.imgProps.dragStartX = e.clientX;
				this.imgProps.dragStartY = e.clientY;
			}
			if (this.imgProps.selecting) {
				this.imgProps.setBox(
					this.imgProps.boxStartX,
					this.imgProps.boxStartY,
					e.clientX - this.imgProps.boxStartX,
					e.clientY - this.imgProps.boxStartY
				);
			}
		});

		window.addEventListener('resize', () => this.updateCanvasSize());
		this.updateCanvasSize();

		this.imgProps.addChangedListener(() => this.initialize());
		this.initialize();

		this.imgProps.addEventListener('close', () => this.destroy());
	}

	initialize() {
		if (this.initialized) return;
		if (isNaN(this.imgProps.canvasHeight) || isNaN(this.imgProps.canvasWidth)) return;
		if (isNaN(this.imgProps.originalHeight) || isNaN(this.imgProps.originalWidth)) return;

		let zoomW = 1;
		if (this.imgProps.originalWidth > this.imgProps.canvasWidth) {
			zoomW = (this.imgProps.canvasWidth - 10) / this.imgProps.originalWidth;
		}
		let zoomH = 1;
		if (this.imgProps.originalHeight > this.imgProps.canvasHeight) {
			zoomH = (this.imgProps.canvasHeight - 10) / this.imgProps.originalHeight;
		}
		this.initialized = true;
		this.imgProps.setZoom(Math.min(zoomH, zoomW));
	}

	updateCanvasSize() {
		this.imgProps.setCanvasSize(window.innerWidth, window.innerHeight);
	}

	addOnCropListener(handler: EventHandler) {
		this.imgProps.addEventListener('cropped', handler);
	}

	destroy() {
		this.wrapper.destroy();
	}

}
