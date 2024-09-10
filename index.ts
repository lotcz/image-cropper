import Editor from './src/Editor'
import DomBuilder from "./src/DomBuilder";
import EventUtil from "./src/EventUtil";

export function cropperCrop(parentElement: any, fileInputElement: any, previewImageElement: any) {

	let editor: Editor = null;

	const destroyEditor = function () {
		if (editor !== null) editor.destroy();
		editor = null;
	}

	const createEditor = function (src: any) {
		editor = new Editor(parentElement, src);
	}

	const fileLoaded = function (e: Event) {
		EventUtil.stop(e);

		const files = (e.target as HTMLInputElement).files
		const f = files[0];
		const fr = new FileReader();

		fr.onload = function (ev) {
			createEditor(ev.target.result);
		};

		fr.readAsDataURL(f);
	}

	DomBuilder.of(fileInputElement).addEventListener('change', fileLoaded);

}

// @ts-ignore
if (window) window['cropperCrop'] = cropperCrop;
