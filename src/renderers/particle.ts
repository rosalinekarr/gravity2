import {Particle, Vector} from '../models';

export interface RenderParticleOpts {
	font: string;
	highlightLineColor: string;
	highlightLineWidth: number;
	nameOffsetX: number;
	nameOffsetY: number;
    particleColor: string;
	selectionHighlightOffset: number;
    showForces: boolean;
	showNames: boolean;
    showVelocities: boolean;
	textColor: string;
    velocityLineColor: string;
    velocityLineScale: number;
    velocityLineWidth: number;
}

function renderParticleBody(ctx: CanvasRenderingContext2D, particle: Particle) {
	ctx.beginPath();
	ctx.arc(particle.position.x, particle.position.y, particle.radius, 0, Math.PI * 2);
	ctx.fill();
}

function renderName(ctx: CanvasRenderingContext2D, particle: Particle, offset: Vector, scale: number, opts: RenderParticleOpts) {
	ctx.fillText(
		particle.name,
		(particle.position.x * scale) + offset.x + (particle.radius * scale) + opts.nameOffsetX,
		(particle.position.y * scale) + offset.y - (particle.radius * scale) - opts.nameOffsetY,
	);
}

function renderVelocity(ctx: CanvasRenderingContext2D, particle: Particle, offset: Vector, scale: number, opts: RenderParticleOpts) {
	const lineVector = particle.velocity.multiply(opts.velocityLineScale);

	ctx.beginPath();
	ctx.moveTo(
		(particle.position.x * scale) + offset.x,
		(particle.position.y * scale) + offset.y,
	);
	ctx.lineTo(
		(particle.position.x * scale) + offset.x + lineVector.x,
		(particle.position.y * scale) + offset.y + lineVector.y,
	);
	ctx.stroke();
}

function renderSelectionHighlights(ctx: CanvasRenderingContext2D, particle: Particle, offset: Vector, scale: number, opts: RenderParticleOpts) {
	ctx.beginPath();
	ctx.arc(
		(particle.position.x * scale) + offset.x,
		(particle.position.y * scale) + offset.y,
		opts.selectionHighlightOffset + (particle.radius * scale),
		0,
		Math.PI * 2,
	);
	ctx.stroke();
}

export function renderParticles(ctx: CanvasRenderingContext2D, particles: Particle[], opts: RenderParticleOpts) {
	ctx.fillStyle = opts.particleColor;
	particles.forEach((p) => renderParticleBody(ctx, p));
}

export function renderSelectedParticles(ctx: CanvasRenderingContext2D, selectedParticles: Particle[], offset: Vector, scale: number, opts: RenderParticleOpts) {
	const {showNames, showVelocities} = opts;
	ctx.lineCap = 'round';

	ctx.lineWidth = opts.velocityLineWidth;
	ctx.strokeStyle = opts.velocityLineColor;
	if (showVelocities)
		selectedParticles.forEach((p) => renderVelocity(ctx, p, offset, scale, opts));

	ctx.fillStyle = opts.textColor;
	ctx.font = opts.font;
	if (showNames)
		selectedParticles.forEach((p) => renderName(ctx, p, offset, scale, opts));

	ctx.lineWidth = opts.highlightLineWidth;
	ctx.strokeStyle = opts.highlightLineColor;
	selectedParticles.forEach((p) => renderSelectionHighlights(ctx, p, offset, scale, opts));
}