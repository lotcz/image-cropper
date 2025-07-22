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

	wrapper: DomBuilder;

	preview: Preview;

	toolbar: Toolbar;

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
			this.startDrag(new Vector2(e.clientX, e.clientY));
		});

		this.wrapper.addEventListener('mousedown', (e: MouseEvent) => {
			EventUtil.stop(e);
			this.startDrag(new Vector2(e.clientX, e.clientY));
		});

		this.wrapper.addEventListener('mouseup', (e: MouseEvent) => {
			EventUtil.stop(e);
			this.stopDrag();
		});

		this.wrapper.addEventListener('mouseout', (e: MouseEvent) => {
			EventUtil.stop(e);
			this.stopDrag();
		});

		this.wrapper.addEventListener('mousemove', (e: MouseEvent) => {
			const pos = new Vector2(e.clientX, e.clientY);
			if (this.imgProps.dragging) {
				const offsetDiff = pos.sub(this.imgProps.dragStart);
				this.imgProps.offset.set(this.imgProps.offset.add(offsetDiff.multiply(1/this.imgProps.zoomImg)));
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

	startSelect(pos: Vector2) {
		if (!this.imgProps.boxSelecting) {
			this.imgProps.boxStart.set(pos);
			this.imgProps.boxSize.set(0, 0);
		}
		this.imgProps.boxSelecting = true;
	}

	startDrag(pos: Vector2) {
		if (!this.imgProps.dragging) {
			this.imgProps.dragStart.set(pos);
		}
		this.imgProps.dragging = true;
	}

	stopDrag() {
		this.imgProps.dragging = false;
	}

	destroy() {
		this.wrapper.destroy();
	}

}
