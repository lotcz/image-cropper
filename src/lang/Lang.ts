import {cs} from "./cs";

export class Lang {
	static t(s: string): string {
		return cs.get(s) || s;
	}
}
