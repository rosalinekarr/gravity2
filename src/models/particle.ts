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
    force: Vector;
    mass: number;
    position: Vector;
    velocity: Vector;

    constructor({mass, position, velocity}: ParticleConstructorArgs) {
        this.mass = mass;
        this.position = position;
        this.velocity = velocity || new Vector(0.0, 0.0);
        this.force = new Vector(0.0, 0.0);
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

    update(timeDelta: number) {
        this.position = new Vector(
          this.position.x + this.velocity.x * timeDelta,
          this.position.y + this.velocity.y * timeDelta,
        );
        this.velocity = new Vector(
          this.velocity.x + this.force.x / this.mass,
          this.velocity.y + this.force.y / this.mass,
        );
    }
    
    applyForce(force: Vector) {
        this.force = force;
    }

    radius() {
        return (10.0 ** -5.7) * Math.sqrt(this.mass);
    }

    serialize(): ParticleSerialization {
        return {
            position: this.position.serialize(),
            velocity: this.velocity.serialize(),
            mass: this.mass,
        };
    }
}