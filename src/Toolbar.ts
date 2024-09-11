import DomBuilder from "./DomBuilder";
import ImgProps from "./ImgProps";
import Component from "./Component";

export default class Toolbar extends Component {

	wrapper: DomBuilder;

	info: DomBuilder;

	actions: DomBuilder;

	constructor(parent: any, imgProps: ImgProps) {
		super(parent, imgProps);
		this.wrapper = DomBuilder.of('div').parent(parent).css('toolbar');

		this.info = DomBuilder.of('div').parent(this.wrapper);
		this.actions = DomBuilder.of('div').parent(this.wrapper);

		DomBuilder.of('button')
			.parent(this.actions)
			.text('Close')
			.addEventListener('click', () => this.imgProps.triggerEvent('close'));


		this.imgProps.addChangedEventListener(() => this.render());
	}

	render() {
		this.info.text(
			`Zoom: ${this.imgProps.zoom},
			Original: ${this.imgProps.originalWidth}px x ${this.imgProps.originalHeight}px,
			Cropped: ${Math.abs(this.imgProps.width)}px x ${Math.abs(this.imgProps.height)}px`
		);
	}
}
