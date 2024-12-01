import DomBuilder from "./core/DomBuilder";
import Preview from "./Preview";
import Toolbar from "./Toolbar";
import EventUtil from "./core/EventUtil";
import ImgProps from "./ImgProps";
import EditorComponent from "./core/EditorComponent";
import {EventHandler} from "./core/LogicalComponent";
import Vector2 from "./core/Vector2";
import {CropperParams} from "./CropperParams";

export default class Editor extends EditorComponent {

	language: string = "cs";

	wrapper: DomBuilder;

	preview: Preview;

	toolbar: Toolbar;

	initialized: boolean = false;

	constructor(params: CropperParams) {
		super(document.body, new ImgProps(params));

		if (params.maxSize) {
			this.imgProps.maxSize = new Vector2(params.maxSize);
		}
		this.imgProps.presetAspects = params.presetAspects.map(ps => new Vector2(ps).toAspectRatio());
		this.imgProps.setSelectedAspectIndex(0);

		this.wrapper = DomBuilder.of('div')
			.parent(this.parent)
			.css('image-cropper-editor');

		this.preview = new Preview(this.wrapper, this.imgProps);
		this.toolbar = new Toolbar(this.wrapper, this.imgProps);

		this.wrapper.addEventListener('wheel', (e: WheelEvent) => {
			EventUtil.stop(e);
			const k = e.deltaY > 0 ? 0.9 : 1.1;
			this.imgProps.setZoom(this.imgProps.zoomImg * k);
		});

		this.wrapper.addEventListener('mousedown', (e: MouseEvent) => {
			EventUtil.stop(e);
			if (e.button === 0) {
				if (!this.imgProps.boxSelecting) {
					this.imgProps.boxStart.set(e.clientX, e.clientY);
					this.imgProps.boxSize.set(0, 0);
				}
				this.imgProps.boxSelecting = true;
			}
			if (e.button === 2) {
				if (!this.imgProps.dragging) {
					this.imgProps.dragStart.set(e.clientX, e.clientY);
				}
				this.imgProps.dragging = true;
			}
		});

		this.wrapper.addEventListener('mouseup', (e: MouseEvent) => {
			EventUtil.stop(e);
			if (e.button === 0) {
				this.imgProps.boxSelecting = false;
			}
			if (e.button === 2) {
				this.imgProps.dragging = false;
			}
		});

		this.wrapper.addEventListener('mousemove', (e: MouseEvent) => {
			const pos = new Vector2(e.clientX, e.clientY);
			if (this.imgProps.dragging) {
				this.imgProps.offset.set(this.imgProps.offset.add(pos).sub(this.imgProps.dragStart));
				this.imgProps.dragStart.set(pos);
			}
			if (this.imgProps.boxSelecting) {
				this.imgProps.boxSize.set(pos.sub(this.imgProps.boxStart));
			}
		});

		window.addEventListener('resize', () => this.updateCanvasSize());
		this.updateCanvasSize();

		this.imgProps.addEventListener('close', () => this.destroy());
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
