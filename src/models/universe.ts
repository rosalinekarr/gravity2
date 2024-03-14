import Force, {ForceSerialization} from './force';
import Particle, {ParticleSerialization} from './particle';
import Vector from './vector';

interface UniverseConstructorArgs {
    forces?: Force[];
    particles: Particle[];
}

interface UniverseGenerateOptions {
    maxMass: number;
    minMass: number;
    particleCount: number;
    particleDensity: number;
    noOverlappingParticles: boolean;
}

export interface UniverseRuntimeOptions {
    gravitationalConstant: number;
    particleDensity: number;
    timeScale: number;
}

type UniverseSerialization = {
    particles: ParticleSerialization[];
    forces: ForceSerialization[];
}

export default class Universe {
	particles: Particle[];
	forces: Force[];

	constructor({forces, particles}: UniverseConstructorArgs) {
		this.particles = particles;
		this.forces = forces || [
			Force.gravity({lineColor: '#00FF00'}),
			Force.normal({lineColor: '#0000FF'}),
		];
	}

	static generate({
		maxMass,
		minMass,
		particleCount,
		particleDensity,
		noOverlappingParticles,
	}: UniverseGenerateOptions) {
		let particles: Particle[] = [];

		for (let i = 0; i < particleCount; i++) {
			let newParticle: Particle;

			do {
				const randPositionRadius = Math.sqrt(Math.random()) * 3000.0;
				const randPositionAngle = Math.random() * Math.PI * 2.0;
				newParticle = new Particle({
					mass: Math.random() * (maxMass - minMass) + minMass,
					position: new Vector(
						Math.sin(randPositionAngle) * randPositionRadius,
						Math.cos(randPositionAngle) * randPositionRadius,
					),
				})
			} while (noOverlappingParticles && particles.find((existingParticle) =>
				Particle.isOverlapping(newParticle, existingParticle, {particleDensity})
			));
    
			particles = [
				...particles,
				newParticle,
			];
		}

		return new Universe({particles});
	}

	static deserialize({particles, forces}: UniverseSerialization) {
		return new Universe({
			particles: particles.map(Particle.deserialize),
			forces: forces.map(Force.deserialize),
		});
	}

	update(timeDelta: number, opts: UniverseRuntimeOptions) {
		this.particles.forEach((particle: Particle) => particle.update(timeDelta * opts.timeScale));
      
		this.forces.forEach((force: Force) => {
			force
				.calculateForces(this.particles, opts)
				.forEach((f: Vector, i) =>
					this.particles[i].applyForce(f)
				)
		});
	}

	serialize(): UniverseSerialization {
		return {
			particles: this.particles.map((p) => p.serialize()),
			forces: this.forces.map((f) => f.serialize()),
		};
	}
}