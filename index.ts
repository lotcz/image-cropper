import Editor from './src/Editor'
import DomBuilder from "./src/core/DomBuilder";
import EventUtil from "./src/core/EventUtil";
import {CropperResult} from "./src/CropperResult";
import Vector2 from "./src/core/Vector2";

export function imageCropperListen(fileInputElement: any, previewImageElement: any, sizes?: Array<Array<number>>) {

	let editor: Editor = null;

	let preview: HTMLImageElement | null = null;

	const destroyEditor = function () {
		if (editor !== null) editor.destroy();
		editor = null;
	}

	try {
		preview = <HTMLImageElement>DomBuilder.of(previewImageElement).build();
	} catch (e) {
		console.log('No preview for cropper specified');
		preview = null;
	}

	const createEditor = function (src: any) {
		destroyEditor();
		editor = new Editor(
			{
				imgSrc: src,
				presetSizes: sizes || []
			}
		);
		editor.addOnCropListener((result: CropperResult) => {
			if (preview != null) {
				DomBuilder.of(preview)
					.attr('width', result.croppedSize.x)
					.attr('height', result.croppedSize.y)
					.attr('src', URL.createObjectURL(result.src));
			}
			const fileInput = <HTMLInputElement>DomBuilder.of(fileInputElement).build();
			const file = new File([result.src], fileInput.value, {type: "image/jpeg", lastModified:new Date().getTime()});
			const container = new DataTransfer();
			container.items.add(file);
			fileInput.files = container.files;
		});
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
if (window) window['imageCropperListen'] = imageCropperListen;
