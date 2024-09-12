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
		destroyEditor();
		editor = new Editor(parentElement, src);
		editor.addOnCropListener((blob: any) => {
			try {
				const preview = <HTMLImageElement>DomBuilder.of(previewImageElement).build();
				preview.src = URL.createObjectURL(blob);
			} catch (e) {
				console.log('No preview for cropper specified');
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
if (window) window['cropperCrop'] = cropperCrop;
