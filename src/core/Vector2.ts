import LogicalComponent from "./LogicalComponent";
import Util from "./Util";

export default class Vector2 extends LogicalComponent {
	x: number;
	y: number;

	constructor(x: number | Array<number> | Vector2 = 0, y?: number) {
		super();
		this.set(x, y);
	}

	distanceTo(v: Vector2): number {
		return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
	}

	equalsTo(v: Vector2): boolean {
		return this.x === v.x && this.y === v.y;
	}

	/**
	 *
	 * @param x Number|Vector2
	 * @param y Number|undefined
	 */
	set(x: number | Array<number> | Vector2, y? : number): void {
		if (x instanceof Vector2) {
			this.set(x.x, x.y);
			return;
		} else if (x instanceof Array) {
			this.set(x[0], x[1]);
			return;
		}

		if (this.x !== x || this.y !== y) {
			this.x = Number(x);
			this.y = y;
			this.triggerChangedEvent();
		}
	}

	size(): number {
		const dist = this.distanceTo(new Vector2(0, 0));
		return Number.isNaN(dist) ? 0 : dist;
	}

	setSize(size: number) {
		const currentSize = this.size();
		if (currentSize !== 0) {
			const ratio = size / currentSize;
			this.set(this.x * ratio, this.y * ratio);
		}
		return this;
	}

	round(): Vector2 {
		return new Vector2(Math.round(this.x), Math.round(this.y));
	}

	add(v: Vector2): Vector2 {
		return new Vector2(this.x + v.x, this.y + v.y);
	}

	multiply(s: number): Vector2 {
		return new Vector2(this.x * s, this.y * s);
	}

	subtract(v: Vector2): Vector2 {
		return new Vector2(this.x - v.x, this.y - v.y);
	}

	sub(v: Vector2): Vector2 {
		return this.subtract(v);
	}

	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	toAspectRatio(): Vector2 {
		let gcd = Util.gcd(this.x, this.y);
		if (gcd > 1) return new Vector2(this.x / gcd, this.y / gcd).toAspectRatio();
		return this.clone();
	}

	toString(decimals = 2): string {
		return `[${Util.round(this.x, decimals)},${Util.round(this.y, decimals)}]`;
	}

	toJson(format = false): string {
		return JSON.stringify({x: this.x, y: this.y}, undefined, format ? 2 : undefined);
	}

	/**
	 * Return vector whose sizes are equal or less than clamping value while keeping the aspect ratio.
	 */
	clamp(max: Vector2): Vector2 {
		const rx = max.x < this.x ? max.x / this.x : 1;
		const ry = max.y < this.y ? max.y / this.y : 1;
		return this.multiply(Math.min(rx, ry));
	}

	/**
	 * Return vector whose one size is equal and other is less than max clamping value while keeping the aspect ratio.
	 */
	fill(target: Vector2): Vector2 {
		const rx = target.x / this.x;
		const ry = target.y / this.y;
		return this.multiply(Math.max(rx, ry)).clamp(target);
	}

}
