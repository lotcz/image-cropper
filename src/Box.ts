import DomBuilder from "./DomBuilder";
import ImgProps from "./ImgProps";
import Component from "./Component";

export default class Box extends Component {

	wrapper: DomBuilder;

	constructor(parent: any, imgProps: ImgProps) {
		super(parent, imgProps);
		this.wrapper = DomBuilder.of('div').parent(parent).css('box');
		this.imgProps.addChangedEventListener(() => this.render());
	}

	render() {
		this.wrapper
			.toggleCss('visually-hidden', !(this.imgProps.boxWidth > 0))
			.style('left', `${this.imgProps.boxWidth > 0 ? this.imgProps.boxStartX : this.imgProps.boxStartX + this.imgProps.boxWidth}px`)
			.style('top', `${this.imgProps.boxHeight > 0 ? this.imgProps.boxStartY : this.imgProps.boxStartY + this.imgProps.boxHeight}px`)
			.style('width', `${Math.abs(this.imgProps.boxWidth)}px`)
			.style('height', `${Math.abs(this.imgProps.boxHeight)}px`)
			.build();
	}
}
