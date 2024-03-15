import {Force, Particle, Vector} from '../models';

function renderForceVector(ctx: CanvasRenderingContext2D, forceVector: Vector, particle: Particle, offset: Vector, scale: number) {
	ctx.beginPath();
	ctx.moveTo(particle.position.x * scale + offset.x, particle.position.y * scale + offset.y);
	ctx.lineTo(
		(particle.position.x * scale) + offset.x + forceVector.x,
		(particle.position.y * scale) + offset.y + forceVector.y,
	);
	ctx.stroke();
}

function renderForce(ctx: CanvasRenderingContext2D, force: Force, particles: Particle[], offset: Vector, scale: number,) {
	ctx.lineWidth = force.lineWidth;
	ctx.strokeStyle = force.lineColor;

	force.calculateForces(particles).forEach((forceVector, i) =>
		renderForceVector(ctx, forceVector.multiply(force.lineScale), particles[i], offset, scale)
	)
}

export default function renderForces(ctx: CanvasRenderingContext2D, forces: Force[], particles: Particle[], offset: Vector, scale: number,) {
	forces.forEach((force: Force) => renderForce(ctx, force, particles, offset, scale));
}
