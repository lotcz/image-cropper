export default class DomBuilder {

	public element: HTMLElement;

	constructor(element: HTMLElement) {
		if (!element) throw new Error("Element must be provided for Dom Builder!");
		this.element = element;
	}

	// CREATING THE BUILDER

	static ofElement(element: HTMLElement): DomBuilder {
		return new DomBuilder(element);
	}

	static ofTag(tag: string): DomBuilder {
		return DomBuilder.ofElement(document.createElement(tag));
	}

	static ofId(id: string): DomBuilder {
		return DomBuilder.ofElement(document.getElementById(id));
	}

	static ofQuery(selector: string): DomBuilder {
		return DomBuilder.ofElement(document.querySelector(selector));
	}

	static of(something: any): DomBuilder {
		if (something instanceof DomBuilder) return something;
		if (something instanceof HTMLElement) return DomBuilder.ofElement(something);
		if (typeof something === 'string') {
			if (something.includes(' ') || something.startsWith('.') || something.startsWith('#')) return DomBuilder.ofQuery(something);
			return DomBuilder.ofTag(something);
		}
		throw new Error(`Could not determine how to create DOM element! Provided: "${something}"`);
	}

	static ofElse(something: any, somethingElse: any): DomBuilder {
		try {
			return DomBuilder.of(something);
		} catch (e: any) {
			if (typeof somethingElse === 'function') {
				return DomBuilder.of(somethingElse());
			}
			return DomBuilder.of(somethingElse);
		}
	}

	// BUILDER METHODS

	parent(something: any): DomBuilder {
		DomBuilder.of(something).build().appendChild(this.element);
		return this;
	}

	hasCss(cls: string): boolean {
		return this.element.classList.contains(cls);
	}

	attr(name: string, value: any): DomBuilder {
		this.element.setAttribute(name, value);
		return this;
	}

	toggleAttr(name: string, isPresent: boolean, value: any = true): DomBuilder {
		if (isPresent)
			this.element.setAttribute(name, value)
		else
			this.element.removeAttribute(name);
		return this;
	}

	html(content: string): DomBuilder {
		this.element.innerHTML = content;
		return this;
	}

	text(content: string): DomBuilder {
		return this.html(content);
	}

	addCss(css: string): DomBuilder {
		css.split(' ').forEach((cls) => {
			if (typeof cls === 'string' && cls.length > 0 && !this.hasCss(cls)) this.element.classList.add(cls);
		});
		return this;
	}

	removeCss(css: string): DomBuilder {
		css.split(' ').forEach((cls) => {
			if (typeof cls === 'string' && cls.length > 0 && this.hasCss(cls)) this.element.classList.remove(cls);
		});
		return this;
	}

	toggleCss(css: string, use: boolean): DomBuilder {
		if (use) return this.addCss(css);
		return this.removeCss(css);
	}

	css(css: string): DomBuilder {
		this.element.className = css;
		return this;
	}

	style(name: string, value: string): DomBuilder {
		this.element.style.setProperty(name, value);
		return this;
	}

	addEventListener(event: string, handler: EventListenerOrEventListenerObject): DomBuilder {
		this.element.addEventListener(event, handler);
		return this;
	}

	removeEventListener(event: string, handler: EventListenerOrEventListenerObject): DomBuilder {
		this.element.removeEventListener(event, handler);
		return this;
	}

	destroy(): void {
		 this.element.remove();
	}

	build(): HTMLElement {
		return this.element;
	}

	// GENERAL UTILITIES

	static hasCssClass(something: any, className: string): boolean {
		return DomBuilder.of(something).hasCss(className);
	}

	static addCssClass(something: any, cls: string): DomBuilder {
		return DomBuilder.of(something).addCss(cls);
	}

	static destroyDom(something: any) {
		DomBuilder.of(something).destroy();
	}

}
