import Particle, {ParticleSerialization} from './particle';
import Vector from './vector';

interface UniverseConstructorArgs {
    particles: Particle[];
}

interface UniverseGenerateOptions {
    maxMass: number;
    minMass: number;
    particleCount: number;
}

interface UniverseRuntimeOptions {
    gravitationalConstant: number;
    particleDensity: number;
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
        maxMass,
        minMass,
        particleCount,
    }: UniverseGenerateOptions) {
        return new Universe({
            particles: Array.from({length: particleCount}, () => {
                const randPositionRadius = Math.sqrt(Math.random()) * 3000.0;
                const randPositionAngle = Math.random() * Math.PI * 2.0;
        
                return new Particle({
                    mass: Math.random() * (maxMass - minMass) + minMass,
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
        this.particles.map((particle: Particle) => particle.update(timeDelta * opts.timeScale));
      
        this.particles.map((pA: Particle) =>
            pA.applyForce(
                this.particles.reduce(
                    (acc: Vector, pB: Particle): Vector => {
                        const sqrDistance = ((pA.position.x - pB.position.x) ** 2) + ((pA.position.y - pB.position.y) ** 2);
                        if (sqrDistance > (pA.radius(opts) + pB.radius(opts)) ** 2) {
                            const force = opts.gravitationalConstant * pA.mass * pB.mass / sqrDistance;
                            return Vector.diff(pB.position, pA.position).normalize().multiply(force).add(acc);
                        } else if (sqrDistance > 0.0) {
                            return Vector.diff(pA.position, pB.position).normalize().multiply(
                                Vector.dotProduct(pB.velocity, Vector.diff(pA.position, pB.position))
                            ).add(acc);
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