import Vector, {VectorSerialization} from './vector';

interface ParticleConstructorArgs {
    mass: number;
	name: string;
    position: Vector;
	radius: number;
    velocity?: Vector;
}

export type ParticleSerialization = {
    mass: number;
	name: string;
    position: VectorSerialization;
	radius: number;
    velocity: VectorSerialization;
}

export default class Particle {
	mass: number;
	name: string;
	position: Vector;
	radius: number;
	velocity: Vector;

	constructor({mass, name, position, radius, velocity}: ParticleConstructorArgs) {
		this.mass = mass;
		this.name = name;
		this.position = position;
		this.radius = radius;
		this.velocity = velocity || new Vector(0.0, 0.0);
	}

	static deserialize({mass, name, radius, position, velocity}: ParticleSerialization) {
		return new Particle({
			mass,
			name,
			position: Vector.deserialize(position),
			radius,
			...(velocity ? {
				velocity: Vector.deserialize(velocity),
			} : {}),
		});
	}

	static isOverlapping(pA: Particle, pB: Particle) {
		const pDiff = Vector.diff(pB.position, pA.position);
		const distance = pDiff.magnitude();
		return distance < pA.radius + pB.radius;
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

	momentum() {
		return this.velocity.multiply(this.mass);
	}

	serialize(): ParticleSerialization {
		return {
			mass: this.mass,
			name: this.name,
			position: this.position.serialize(),
			radius: this.radius,
			velocity: this.velocity.serialize(),
		};
	}
}