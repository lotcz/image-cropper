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
			.style('left', `${this.imgProps.width > 0 ? this.imgProps.x : this.imgProps.x + this.imgProps.width}px`)
			.style('top', `${this.imgProps.height > 0 ? this.imgProps.y : this.imgProps.y + this.imgProps.height}px`)
			.style('width', `${Math.abs(this.imgProps.width)}px`)
			.style('height', `${Math.abs(this.imgProps.height)}px`)
			.build();
	}
}
