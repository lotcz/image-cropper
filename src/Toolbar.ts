import DomBuilder from "./DomBuilder";
import ImgProps from "./ImgProps";
import EditorComponent from "./EditorComponent";
import EventUtil from "./EventUtil";

export default class Toolbar extends EditorComponent {

	wrapper: DomBuilder;

	zoomInfo: DomBuilder;

	originalInfo: DomBuilder;

	croppedInfo: DomBuilder;

	buttons: DomBuilder;

	cropButton: DomBuilder;

	constructor(parent: any, imgProps: ImgProps) {
		super(parent, imgProps);
		this.wrapper = DomBuilder.of('div')
			.parent(parent)
			.css('toolbar')
			.addEventListener('mousedown', EventUtil.stop);

		this.zoomInfo = DomBuilder.of('div').parent(this.wrapper);
		this.originalInfo = DomBuilder.of('div').parent(this.wrapper);
		this.croppedInfo = DomBuilder.of('div').parent(this.wrapper);
		this.buttons = DomBuilder.of('div').parent(this.wrapper).css('buttons');

		this.cropButton = DomBuilder.of('button')
			.parent(this.buttons)
			.text('Crop!')
			.addEventListener('click', (e: Event) => {
				EventUtil.stop(e);
				this.imgProps.triggerEvent('crop');
			});

		DomBuilder.of('button')
			.parent(this.buttons)
			.text('Close')
			.addEventListener('click', (e: Event) => {
				EventUtil.stop(e);
				this.imgProps.triggerEvent('close');
			});

		this.imgProps.addChangedListener(() => this.render());
	}

	render() {
		this.zoomInfo.text(`Zoom: ${this.imgProps.zoom}`);
		this.originalInfo.text(`Original: ${this.imgProps.originalWidth}px x ${this.imgProps.originalHeight}px`);
		this.croppedInfo.text(`Cropped: ${Math.abs(this.imgProps.boxWidth)}px x ${Math.abs(this.imgProps.boxHeight)}px`);
	}
}
