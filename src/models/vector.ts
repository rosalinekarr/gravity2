export type VectorSerialization = [number, number];

export default class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static add(a: Vector, b: Vector) {
        return new Vector(
            a.x + b.x,
            a.y + b.y,
        );
    }

    static deserialize([x, y]: VectorSerialization) {
        return new Vector(x, y);
    }

    static diff(a: Vector, b: Vector) {
        return new Vector(
            a.x - b.x,
            a.y - b.y,
        );
    }

    static dotProduct(a: Vector, b: Vector) {
        return a.x * b.x + a.y * b.y;
    }

    add(a: Vector) {
        return Vector.add(this, a);
    }

    diff(a: Vector) {
        return Vector.diff(this, a);
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    multiply(multiplicand: number) {
        return new Vector(
            this.x * multiplicand,
            this.y * multiplicand,
        );
    }

    normalize() {
        if (this.x === 0 && this.y === 0) return new Vector(0.0, 0.0);
        return new Vector(
            this.x / this.magnitude(),
            this.y / this.magnitude(),
        );
    }

    serialize(): VectorSerialization {
        return [this.x, this.y];
    }
}