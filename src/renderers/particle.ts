import {Particle} from '../models';

export interface RenderParticleOpts {
    particleColor: string;
    particleDensity: number;
    scale: number;
    showForces: boolean;
    showVelocities: boolean;
    velocityLineColor: string;
    velocityLineScale: number;
    velocityLineWidth: number;
}

function renderParticleBody(ctx: CanvasRenderingContext2D, particle: Particle, opts: RenderParticleOpts) {
	const radius = particle.radius(opts) / opts.scale;
	const scrnX = (particle.position.x / opts.scale) + (ctx.canvas.width/2);
	const scrnY = (particle.position.y / opts.scale) + (ctx.canvas.height/2);

	ctx.beginPath();
	ctx.arc(scrnX, scrnY, radius, 0, Math.PI * 2);
	ctx.fill();
}

function renderVelocity(ctx: CanvasRenderingContext2D, particle: Particle, opts: RenderParticleOpts) {
	const scrnX = (particle.position.x / opts.scale) + (ctx.canvas.width/2);
	const scrnY = (particle.position.y / opts.scale) + (ctx.canvas.height/2);
	const lineVector = particle.velocity.multiply(opts.velocityLineScale).add(
		particle.velocity.normalize().multiply(
			particle.radius(opts)
		)
	);

	ctx.beginPath();
	ctx.moveTo(scrnX, scrnY);
	ctx.lineTo(scrnX + lineVector.x / opts.scale, scrnY + lineVector.y / opts.scale);
	ctx.stroke();
}

export default function renderParticles(ctx: CanvasRenderingContext2D, particles: Particle[], opts: RenderParticleOpts) {
	const {showVelocities} = opts;
	ctx.lineCap = 'round';

	ctx.fillStyle = opts.particleColor;
	particles.forEach((p) => renderParticleBody(ctx, p, opts));

	ctx.lineWidth = opts.velocityLineWidth;
	ctx.strokeStyle = opts.velocityLineColor;
	if (showVelocities)
		particles.forEach((p) => renderVelocity(ctx, p, opts));
}