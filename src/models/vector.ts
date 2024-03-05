export type VectorSerialization = [number, number];

export default class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static deserialize([x, y]: VectorSerialization) {
        return new Vector(x, y);
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize() {
        return new Vector(
            this.x / this.magnitude(),
            this.y / this.magnitude(),
        );
    }

    add(a: Vector) {
        return new Vector(
            this.x + a.x,
            this.y + a.y,
        );
    }

    multiply(multiplicand: number) {
        return new Vector(
            this.x * multiplicand,
            this.y * multiplicand,
        );
    }

    serialize(): VectorSerialization {
        return [this.x, this.y];
    }
}