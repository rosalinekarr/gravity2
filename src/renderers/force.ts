import {Force, Particle, Vector} from '../models';
import { UniverseRuntimeOptions } from '../models/universe';

type RenderForceVectorOpts = UniverseRuntimeOptions & {scale: number};

function renderForceVector(ctx: CanvasRenderingContext2D, forceVector: Vector, particle: Particle, opts: RenderForceVectorOpts) {
	const scrnX = (particle.position.x / opts.scale) + (ctx.canvas.width/2);
	const scrnY = (particle.position.y / opts.scale) + (ctx.canvas.height/2);

	ctx.beginPath();
	ctx.moveTo(scrnX, scrnY);
	ctx.lineTo(scrnX + forceVector.x / opts.scale, scrnY + forceVector.y / opts.scale);
	ctx.stroke();
}

function renderForce(ctx: CanvasRenderingContext2D, force: Force, particles: Particle[], opts: RenderForceVectorOpts) {
	ctx.lineWidth = force.lineWidth;
	ctx.strokeStyle = force.lineColor;

	force.calculateForces(particles, opts).forEach((forceVector, i) =>
		renderForceVector(ctx, forceVector.multiply(force.lineScale), particles[i], opts)
	)
}

export default function renderForces(ctx: CanvasRenderingContext2D, forces: Force[], particles: Particle[], opts: RenderForceVectorOpts) {
	forces.forEach((force: Force) => renderForce(ctx, force, particles, opts));
}
