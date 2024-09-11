import DomBuilder from "./DomBuilder";
import ImgProps from "./ImgProps";

export default class Component {

	parent: DomBuilder;

	imgProps: ImgProps;

	constructor(parent: any, imgProps: ImgProps) {
		this.parent = DomBuilder.of(parent);
		this.imgProps = imgProps;
	}
}
