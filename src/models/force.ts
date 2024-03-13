import Color from './color';
import Particle from './particle';
import Vector from './vector';
import type {UniverseRuntimeOptions} from './universe';

type ForceFn = (pA: Particle, pB: Particle, opts: UniverseRuntimeOptions) => Vector;

interface ForceConstructorOpts {
    lineColor?: string;
    lineScale?: number;
    lineWidth?: number;
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

	static gravity() {
		return new Force((pA, pB, opts) => {
			const pDiff = Vector.diff(pB.position, pA.position);``
			const distance = pDiff.magnitude();
			if (distance < pA.radius(opts) + pB.radius(opts)) return Vector.zero();
			return pDiff.normalize().multiply(opts.gravitationalConstant * pA.mass * pB.mass / (distance ** 2));
		});
	}

	static normal() {
		return new Force((pA, pB, opts) => {
			const pDiff = Vector.diff(pB.position, pA.position);
			const relativeVelocity = Vector.diff(pB.velocity, pA.velocity);
			const distance = pDiff.magnitude();
			if (distance > pA.radius(opts) + pB.radius(opts) || distance === 0.0) return Vector.zero();
			return pDiff.normalize().multiply(-pB.mass * (
				(
					pA.radius(opts) + pB.radius(opts) - distance
				) * (
					(Vector.dotProduct(relativeVelocity, pDiff) / distance) ** 2
				)
			))
		});
	}

	calculateForces(particles: Particle[], opts: UniverseRuntimeOptions): Vector[] {
		return particles.map((pA: Particle): Vector =>
			particles.reduce(
				(acc: Vector, pB: Particle): Vector => 
					acc.add(
						this.forceFn(pA, pB, opts)
					),
				new Vector(0.0, 0.0),
			)
		);
	}
}