import Color from './color';
import Particle from './particle';
import Vector from './vector';

type ForceFn = (pA: Particle, pB: Particle) => Vector;

interface ForceConstructorOpts {
    lineColor?: string;
    lineScale?: number;
    lineWidth?: number;
}

export interface ForceSerialization {
	forceFn: string;
    lineColor: string;
    lineScale: number;
    lineWidth: number;
}

export default class Force {
	forceFn: ForceFn;
	lineColor: string;
	lineScale: number;
	lineWidth: number;

	constructor(forceFn: ForceFn, opts: ForceConstructorOpts = {}) {
		this.forceFn = forceFn;
		this.lineColor = opts.lineColor || Color.random().toString();
		this.lineScale = opts.lineScale || 1.0;
		this.lineWidth = opts.lineWidth || 1.0;
	}

	static gravity(opts: ForceConstructorOpts = {}) {
		return new Force((pA, pB) => {
			const G = 6.674 * (10.0 ** -11);
			const pDiff = Vector.diff(pB.position, pA.position);
			const distance = pDiff.magnitude();
			if (Particle.isOverlapping(pA, pB)) return Vector.zero();
			return pDiff.normalize().multiply(G * pA.mass * pB.mass / (distance ** 2));
		}, opts);
	}

	static normal(opts: ForceConstructorOpts = {}) {
		return new Force((pA, pB) => {
			const pDiff = Vector.diff(pB.position, pA.position);
			const distance = pDiff.magnitude();
			if (!Particle.isOverlapping(pA, pB) || distance === 0.0) return Vector.zero();
			return pDiff.normalize().multiply(
				Vector.dotProduct(pB.momentum().add(pA.momentum().multiply(-1)), pDiff.normalize())
			);
		}, opts);
	}

	static deserialize({forceFn: forceFnSource, ...opts}: ForceSerialization) {
		return new Force(eval(forceFnSource), opts);
	}

	calculateForces(particles: Particle[]): Vector[] {
		return particles.map((pA: Particle): Vector =>
			particles.map((pB: Particle): Vector =>
				this.forceFn(pA, pB)
			).reduce((a, x) => a.add(x))
		);
	}

	serialize(): ForceSerialization {
		return {
			forceFn: this.forceFn.toString(),
			lineColor: this.lineColor,
			lineScale: this.lineScale,
			lineWidth: this.lineWidth,
		};
	}
}