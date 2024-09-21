import Editor from './src/Editor'
import DomBuilder from "./src/core/DomBuilder";
import EventUtil from "./src/core/EventUtil";

export function imageCropperListen(parentElement: any, fileInputElement: any, previewImageElement: any) {

	let editor: Editor = null;

	let preview: HTMLImageElement | null = null;

	const destroyEditor = function () {
		if (editor !== null) editor.destroy();
		editor = null;
	}

	try {
		preview = <HTMLImageElement>DomBuilder.of(previewImageElement)
			.addEventListener('click', (e) => createEditor(preview.src))
			.build();
	} catch (e) {
		console.log('No preview for cropper specified');
		preview = null;
	}

	const createEditor = function (src: any) {
		destroyEditor();
		editor = new Editor(parentElement, src);
		editor.addOnCropListener((blob: any) => {
			if (preview != null) {
				preview.src = URL.createObjectURL(blob);
			}
			const fileInput = <HTMLInputElement>DomBuilder.of(fileInputElement).build();
			const file = new File([blob], fileInput.value, {type: "image/jpeg", lastModified:new Date().getTime()});
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
