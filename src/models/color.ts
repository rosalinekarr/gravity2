export default class Color {
	r: number;
	g: number;
	b: number;

	constructor(r: number, g: number, b: number) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	static random() {
		return new Color(
			Math.floor(Math.random() * 256),
			Math.floor(Math.random() * 256),
			Math.floor(Math.random() * 256),
		);
	}

	toString() {
		return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
	}
}