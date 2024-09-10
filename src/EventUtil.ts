export default class EventUtil {

	static stopPropagation(e: Event) {
		e.stopPropagation();
	}

	static preventDefault(e: Event) {
		e.preventDefault();
	}

	static stop(e: Event) {
		EventUtil.stopPropagation(e);
		EventUtil.preventDefault(e);
	}

}
