import {Particle} from '../models';

export interface RenderParticleOpts {
	font: string;
	highlightLineColor: string;
	highlightLineWidth: number;
	nameOffsetX: number;
	nameOffsetY: number;
    particleColor: string;
    scale: number;
	selectionHighlightOffset: number;
    showForces: boolean;
	showNames: boolean;
    showVelocities: boolean;
	textColor: string;
    velocityLineColor: string;
    velocityLineScale: number;
    velocityLineWidth: number;
}

function renderParticleBody(ctx: CanvasRenderingContext2D, particle: Particle, opts: RenderParticleOpts) {
	const radius = particle.radius / opts.scale;
	const scrnX = (particle.position.x / opts.scale) + (ctx.canvas.width/2);
	const scrnY = (particle.position.y / opts.scale) + (ctx.canvas.height/2);

	ctx.beginPath();
	ctx.arc(scrnX, scrnY, radius, 0, Math.PI * 2);
	ctx.fill();
}

function renderName(ctx: CanvasRenderingContext2D, particle: Particle, opts: RenderParticleOpts) {
	const radius = particle.radius / opts.scale;
	const scrnX = (particle.position.x / opts.scale) + (ctx.canvas.width/2);
	const scrnY = (particle.position.y / opts.scale) + (ctx.canvas.height/2);

	ctx.fillText(particle.name, scrnX + radius + opts.nameOffsetX, scrnY - radius - opts.nameOffsetY);
}

function renderVelocity(ctx: CanvasRenderingContext2D, particle: Particle, opts: RenderParticleOpts) {
	const scrnX = (particle.position.x / opts.scale) + (ctx.canvas.width/2);
	const scrnY = (particle.position.y / opts.scale) + (ctx.canvas.height/2);
	const lineVector = particle.velocity.multiply(opts.velocityLineScale);

	ctx.beginPath();
	ctx.moveTo(scrnX, scrnY);
	ctx.lineTo(scrnX + lineVector.x / opts.scale, scrnY + lineVector.y / opts.scale);
	ctx.stroke();
}

function renderSelectionHighlights(ctx: CanvasRenderingContext2D, particle: Particle, opts: RenderParticleOpts) {
	const radius = opts.selectionHighlightOffset + particle.radius / opts.scale;
	const scrnX = (particle.position.x / opts.scale) + (ctx.canvas.width/2);
	const scrnY = (particle.position.y / opts.scale) + (ctx.canvas.height/2);

	ctx.beginPath();
	ctx.arc(scrnX, scrnY, radius, 0, Math.PI * 2);
	ctx.stroke();
}

export default function renderParticles(ctx: CanvasRenderingContext2D, particles: Particle[], selectedParticles: Particle[], opts: RenderParticleOpts) {
	const {showNames, showVelocities} = opts;
	ctx.lineCap = 'round';

	ctx.fillStyle = opts.particleColor;
	particles.forEach((p) => renderParticleBody(ctx, p, opts));

	ctx.lineWidth = opts.velocityLineWidth;
	ctx.strokeStyle = opts.velocityLineColor;
	if (showVelocities)
		particles.forEach((p) => renderVelocity(ctx, p, opts));

	ctx.fillStyle = opts.textColor;
	ctx.font = opts.font;
	if (showNames)
		particles.forEach((p) => renderName(ctx, p, opts));

	ctx.lineWidth = opts.highlightLineWidth;
	ctx.strokeStyle = opts.highlightLineColor;
	selectedParticles.forEach((p) => renderSelectionHighlights(ctx, p, opts));
}