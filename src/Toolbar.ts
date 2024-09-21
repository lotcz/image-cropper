import DomBuilder from "./core/DomBuilder";
import ImgProps from "./ImgProps";
import EditorComponent from "./core/EditorComponent";
import EventUtil from "./core/EventUtil";

export default class Toolbar extends EditorComponent {

	wrapper: DomBuilder;

	zoomInfo: DomBuilder;

	originalInfo: DomBuilder;

	croppedInfo: DomBuilder;

	aspectSelector: DomBuilder;

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
		this.aspectSelector = DomBuilder.of('div').parent(this.wrapper);
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
		this.zoomInfo.text(`Zoom: ${this.imgProps.zoomImg}`);
		this.originalInfo.text(`Original: ${this.imgProps.originalSize.x}px x ${this.imgProps.originalSize.y}px`);
		this.croppedInfo.text(`Cropped: ${Math.abs(this.imgProps.boxSize.x)}px x ${Math.abs(this.imgProps.boxSize.y)}px`);
		this.cropButton.toggleAttr('disabled', this.imgProps.boxSize.size() === 0);
	}
}
