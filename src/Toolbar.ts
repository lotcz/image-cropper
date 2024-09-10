import DomBuilder from "./DomBuilder";
import ImgProps from "./ImgProps";

export default class Toolbar {

	wrapper: DomBuilder;

	imgProps: ImgProps;

	constructor(parent: any, imgProps: ImgProps) {
		this.wrapper = DomBuilder.of('div').parent(parent).css('toolbar');
		this.imgProps = imgProps;

		this.imgProps.addChangedEventListener(() => this.render());
	}

	render() {
		this.wrapper.text(
			`Original: ${this.imgProps.originalWidth}px x ${this.imgProps.originalHeight}px,
			Cropped: ${Math.abs(this.imgProps.width)}px x ${Math.abs(this.imgProps.height)}px`
		);
	}
}
