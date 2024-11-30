export default class Util {

	static round(n: number, decimals: number = 0): number {
		const d = Math.pow(10, decimals);
		return Math.round(n * d) / d;
	}

	/**
	 * Greatest common divisor
	 */
	static gcd = (a: number, b: number): number => {
		if (b === 0) return a;
		return Util.gcd(b, a % b);
	}

}
