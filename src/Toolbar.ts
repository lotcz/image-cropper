import DomBuilder from "./core/DomBuilder";
import ImgProps from "./ImgProps";
import EditorComponent from "./core/EditorComponent";
import EventUtil from "./core/EventUtil";
import {Lang} from "./lang/Lang";
import Util from "./core/Util";

export default class Toolbar extends EditorComponent {

	wrapper: DomBuilder;

	zoomInfo: DomBuilder;

	originalInfo: DomBuilder;

	croppedInfo: DomBuilder;

	aspectSelector: DomBuilder;

	sizeSelector: DomBuilder;

	buttons: DomBuilder;

	cropButton: DomBuilder;

	constructor(parent: any, imgProps: ImgProps) {
		super(parent, imgProps);
		this.wrapper = DomBuilder.of('form')
			.parent(parent)
			.css('toolbar')
			.addEventListener('mousedown', EventUtil.stopPropagation)
			.addEventListener('submit', EventUtil.stop);

		this.zoomInfo = DomBuilder.of('div').parent(this.wrapper);
		this.originalInfo = DomBuilder.of('div').parent(this.wrapper);
		this.croppedInfo = DomBuilder.of('div').parent(this.wrapper);
		this.aspectSelector = DomBuilder.of('div').parent(this.wrapper);
		this.sizeSelector = DomBuilder.of('div').parent(this.wrapper);
		this.buttons = DomBuilder.of('div').parent(this.wrapper).css('buttons');

		// ASPECT

		const aspSelect = DomBuilder.of('select')
			.parent(this.aspectSelector)
			.attr('id', 'aspect')
			.attr('name', 'aspect')
			.addEventListener(
				'change',
				(e) => this.imgProps.setSelectedAspectIndex(Number((e.target as HTMLInputElement).value))
			);
		this.imgProps.presetAspects.forEach(
			(a, i) => DomBuilder.of('option')
				.parent(aspSelect)
				.attr('value', i)
				.text(`${a.x}:${a.y}`)
				.build()
		);

		// SIZE

		const sizeSelect = DomBuilder.of('select')
			.parent(this.sizeSelector)
			.attr('id', 'size')
			.attr('name', 'size')
			.addEventListener(
				'change',
				(e) => this.imgProps.setSelectedAspectIndex(Number((e.target as HTMLInputElement).value))
			);
		this.imgProps.presetMaxSizes.forEach(
			(a, i) => DomBuilder.of('option')
				.parent(sizeSelect)
				.attr('value', i)
				.text(`${a.x}:${a.y}`)
				.build()
		);

		// BUTTONS

		this.cropButton = DomBuilder.of('button')
			.parent(this.buttons)
			.text(Lang.t('Crop'))
			.addEventListener('click', (e: Event) => {
				EventUtil.stop(e);
				this.imgProps.triggerEvent('crop');
			});

		DomBuilder.of('button')
			.parent(this.buttons)
			.text(Lang.t('Use original'))
			.addEventListener('click', (e: Event) => {
				EventUtil.stop(e);
				this.imgProps.triggerEvent('close');
			});



		this.imgProps.addChangedListener(() => this.render());
	}

	render() {
		this.zoomInfo.text(`Zoom: ${Util.round(this.imgProps.zoomImg, 2)}`);
		this.originalInfo.text(`Original: ${this.imgProps.originalSize.x}px x ${this.imgProps.originalSize.y}px`);
		this.croppedInfo.text(`Cropped: ${Util.round(Math.abs(this.imgProps.boxSize.x), 1)}px x ${Util.round(Math.abs(this.imgProps.boxSize.y), 1)}px`);
		this.cropButton.toggleAttr('disabled', this.imgProps.boxSize.size() === 0);
	}
}
