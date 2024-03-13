import Vector, {VectorSerialization} from './vector';

interface ParticleConstructorArgs {
    mass: number;
    position: Vector;
    velocity?: Vector;
}

export type ParticleSerialization = {
    mass: number;
    position: VectorSerialization;
    velocity: VectorSerialization;
}

export default class Particle {
	mass: number;
	position: Vector;
	velocity: Vector;

	constructor({mass, position, velocity}: ParticleConstructorArgs) {
		this.mass = mass;
		this.position = position;
		this.velocity = velocity || new Vector(0.0, 0.0);
	}

	static deserialize({mass, position, velocity}: ParticleSerialization) {
		return new Particle({
			mass,
			position: Vector.deserialize(position),
			...(velocity ? {
				velocity: Vector.deserialize(velocity),
			} : {}),
		});
	}

	static isOverlapping(pA: Particle, pB: Particle, opts: {particleDensity: number}) {
		const pDiff = Vector.diff(pB.position, pA.position);
		const distance = pDiff.magnitude();
		return distance < pA.radius(opts) + pB.radius(opts);
	}

	update(timeDelta: number) {
		this.position = new Vector(
			this.position.x + this.velocity.x * timeDelta,
			this.position.y + this.velocity.y * timeDelta,
		);
	}
    
	applyForce(force: Vector) {
		this.velocity = new Vector(
			this.velocity.x + force.x / this.mass,
			this.velocity.y + force.y / this.mass,
		);
	}

	radius(opts: {particleDensity: number}) {
		return Math.abs((this.mass / opts.particleDensity) ** (1.0/3.0));
	}

	serialize(): ParticleSerialization {
		return {
			position: this.position.serialize(),
			velocity: this.velocity.serialize(),
			mass: this.mass,
		};
	}
}