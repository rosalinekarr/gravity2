import Force, {ForceSerialization} from './force';
import Particle, {ParticleSerialization} from './particle';
import Vector from './vector';

const TELESCOPE_NAMES: string[] = [
	'BATS',
	'Manley',
	'FAU',
	'TRAPPY',
	'HORNeT',
];

interface UniverseConstructorArgs {
    forces?: Force[];
    particles: Particle[];
}

interface UniverseGenerateOptions {
    maxMass: number;
    minMass: number;
    particleCount: number;
	particleDensity?: number;
    noOverlappingParticles: boolean;
}

export interface UniverseRuntimeOptions {
    gravitationalConstant: number;
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
				const x = Math.sin(randPositionAngle) * randPositionRadius;
				const y = Math.cos(randPositionAngle) * randPositionRadius;
				const mass = Math.random() * (maxMass - minMass) + minMass;

				newParticle = new Particle({
					mass,
					name: `${TELESCOPE_NAMES[Math.floor(Math.random() * TELESCOPE_NAMES.length)]}-${Math.abs(Math.floor(x + y) % 100)}`,
					position: new Vector(x, y),
					radius: (mass / (4.0 * Math.PI / 3.0)) ** (1.0/3.0) / (particleDensity || 10.0),
				})
			} while (noOverlappingParticles && particles.find((existingParticle) =>
				Particle.isOverlapping(newParticle, existingParticle)
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

	selectParticles(x: number, y: number): Particle[] {
		return this.particles.filter((p) => 
			(new Vector(x, y)).add(p.position.multiply(-1)).magnitude() < p.radius
		)
	}

	update(timeDelta: number) {
		this.particles.forEach((particle: Particle) => particle.update(timeDelta));
      
		this.forces.forEach((force: Force) => {
			force
				.calculateForces(this.particles)
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