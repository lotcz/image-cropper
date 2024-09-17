export default class Util {

	static round(n: number, decimals: number = 0): number {
		const d = Math.pow(10, decimals);
		return Math.round(n * d) / d;
	}
}
