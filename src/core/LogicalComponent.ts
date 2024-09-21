export type EventHandler = { (arg?: any): void; }
export type EventHandlers = Array<EventHandler>;
export type EventHandlersCache = Map<string, EventHandlers>;

export default class LogicalComponent {

	handlers: EventHandlersCache = new Map<string, EventHandlers>();

	children: Array<LogicalComponent> = [];

	onChangedHandler: EventHandler = () => this.triggerChangedEvent();

	addEventListener(event: string, handler: EventHandler) {
		if (!this.handlers.has(event)) this.handlers.set(event, []);
		this.handlers.get(event).push(handler);
	}

	triggerEvent(event: string, arg?: any) {
		if (!this.handlers.has(event)) return;
		this.handlers.get(event).forEach((h: EventHandler) => h(arg));
	}

	addChangedListener(handler: EventHandler) {
		this.addEventListener('change', handler);
	}

	triggerChangedEvent() {
		this.triggerEvent('change');
	}

	addChild(child: LogicalComponent) {
		this.children.push(child);
		child.addChangedListener(this.onChangedHandler);
	}
}
