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
		this.aspectSelector = DomBuilder.of('div').parent(this.wrapper).css('row');
		this.buttons = DomBuilder.of('div').parent(this.wrapper).css('buttons');

		// ASPECT

		DomBuilder.of('div')
			.parent(this.aspectSelector)
			.text(Lang.t('Aspect') + ':');
		const aspSelectWrap = DomBuilder.of('div')
			.parent(this.aspectSelector)
		const aspSelect = DomBuilder.of('select')
			.parent(aspSelectWrap)
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

		// BUTTONS

		DomBuilder.of('a')
			.parent(this.buttons)
			.attr('href', '#')
			.text(Lang.t('Close'))
			.addEventListener('click', (e: Event) => {
				EventUtil.stop(e);
				this.imgProps.triggerEvent('close');
			});

		this.cropButton = DomBuilder.of('button')
			.parent(this.buttons)
			.text(Lang.t('Crop'))
			.addEventListener('click', (e: Event) => {
				EventUtil.stop(e);
				this.imgProps.triggerEvent('crop');
			});

		this.imgProps.addChangedListener(() => this.render());
	}

	render() {
		this.zoomInfo.text(`${Lang.t('Zoom')}: ${Util.round(this.imgProps.zoomImg, 2)}x`);
		this.originalInfo.text(`${Lang.t('Original')}: ${this.imgProps.originalSize.x}px x ${this.imgProps.originalSize.y}px`);
		this.croppedInfo.text(`${Lang.t('Final')}: ${Util.round(Math.abs(this.imgProps.finalSize.x))}px x ${Util.round(Math.abs(this.imgProps.finalSize.y))}px`);
		this.cropButton.toggleAttr('disabled', this.imgProps.boxSize.size() === 0);
	}
}
