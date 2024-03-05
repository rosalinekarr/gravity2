import Particle, {ParticleSerialization} from './particle';
import Vector from './vector';

interface UniverseConstructorArgs {
    particles: Particle[];
}

interface UniverseGenerateOptions {
    particleCount: number;
}

interface UniverseRuntimeOptions {
    gravitationalConstant: number;
    timeScale: number;
}

type UniverseSerialization = {
    particles: ParticleSerialization[];
}

export default class Universe {
    particles: Particle[];

    constructor({particles}: UniverseConstructorArgs) {
        this.particles = particles;
    }

    static generate({
        particleCount,
    }: UniverseGenerateOptions) {
        return new Universe({
            particles: Array.from({length: particleCount}, (_) => {
                const randPositionRadius = Math.sqrt(Math.random()) * 3000.0;
                const randPositionAngle = Math.random() * Math.PI * 2.0;
        
                return new Particle({
                    mass: Math.random() ** 2 * (10.0 ** 14),
                    position: new Vector(
                        Math.sin(randPositionAngle) * randPositionRadius,
                        Math.cos(randPositionAngle) * randPositionRadius,
                    ),
                });
            })
        });
    }

    static deserialize({particles}: UniverseSerialization) {
        return new Universe({
            particles: particles.map(Particle.deserialize),
        });
    }

    update(timeDelta: number, opts: UniverseRuntimeOptions) {
        this.particles.map((particle: Particle) => particle.update(timeDelta));
      
        this.particles.map((pA: Particle) =>
            pA.applyForce(
                this.particles.reduce(
                    (acc: Vector, pB: Particle): Vector => {
                        const sqrDistance = ((pA.position.x - pB.position.x) ** 2) + ((pA.position.y - pB.position.y) ** 2);
                        if (sqrDistance > (pA.radius() + pB.radius()) ** 2) {
                            const force = opts.gravitationalConstant * pA.mass * pB.mass / sqrDistance;
                            return new Vector(
                                pB.position.x - pA.position.x,
                                pB.position.y - pA.position.y,
                            ).normalize().multiply(force).add(acc);
                        }
                        return acc;
                    },
                    new Vector(0.0, 0.0),
                )
            )
        );
    }

    serialize(): UniverseSerialization {
        return {
            particles: this.particles.map((p) => p.serialize()),
        };
    }
}