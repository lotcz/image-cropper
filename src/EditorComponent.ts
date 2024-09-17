import DomBuilder from "./DomBuilder";
import ImgProps from "./ImgProps";
import LogicalComponent from "./LogicalComponent";

export default class EditorComponent extends LogicalComponent {

	parent: DomBuilder;

	imgProps: ImgProps;

	constructor(parent: any, imgProps: ImgProps) {
		super();
		this.parent = DomBuilder.of(parent);
		this.imgProps = imgProps;
	}

}
