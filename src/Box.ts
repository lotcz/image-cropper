import DomBuilder from "./DomBuilder";
import ImgProps from "./ImgProps";

export default class Box {

	wrapper: DomBuilder;

	constructor(parent: any) {
		this.wrapper = DomBuilder.of('div').parent(parent).css('box');

	}

	render(imgProps: ImgProps) {
		this.wrapper
			.style('left', `${imgProps.width > 0 ? imgProps.x : imgProps.x + imgProps.width}px`)
			.style('top', `${imgProps.height > 0 ? imgProps.y : imgProps.y + imgProps.height}px`)
			.style('width', `${Math.abs(imgProps.width)}px`)
			.style('height', `${Math.abs(imgProps.height)}px`)
			.build();
	}
}
