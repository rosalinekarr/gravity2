import {Particle} from '../models';

interface RenderParticleOpts {
    scale?: number;
    showForces?: boolean;
    showVelocities?: boolean;
}

const DEFAULT_SCALE = 1.0;

function getScale(opts: RenderParticleOpts) {
    return opts.scale || DEFAULT_SCALE;
}

function renderParticleBody(ctx: CanvasRenderingContext2D, particle: Particle, opts: RenderParticleOpts) {
    const radius = particle.radius() / getScale(opts);
    const scrnX = (particle.position.x / getScale(opts)) + (ctx.canvas.width/2);
    const scrnY = (particle.position.y / getScale(opts)) + (ctx.canvas.height/2);

    ctx.beginPath();
    ctx.arc(scrnX, scrnY, radius, 0, Math.PI * 2);
    ctx.fill();
}

function renderForces(ctx: CanvasRenderingContext2D, particle: Particle, opts: RenderParticleOpts) {
    const scrnX = (particle.position.x / getScale(opts)) + (ctx.canvas.width/2);
    const scrnY = (particle.position.y / getScale(opts)) + (ctx.canvas.height/2);

    ctx.beginPath();
    ctx.moveTo(scrnX, scrnY);
    ctx.lineTo(scrnX + particle.force.x * 0.00000000001 / getScale(opts), scrnY + particle.force.y * 0.00000000001 / getScale(opts));
    ctx.closePath();
    ctx.stroke();
}

function renderVelocities(ctx: CanvasRenderingContext2D, particle: Particle, opts: RenderParticleOpts) {
    const scrnX = (particle.position.x / getScale(opts)) + (ctx.canvas.width/2);
    const scrnY = (particle.position.y / getScale(opts)) + (ctx.canvas.height/2);

    ctx.beginPath();
    ctx.moveTo(scrnX, scrnY);
    ctx.lineTo(scrnX + particle.velocity.x * 10.0 / getScale(opts), scrnY + particle.velocity.y * 10.0 / getScale(opts));
    ctx.closePath();
    ctx.stroke();
}

export default function renderParticles(ctx: CanvasRenderingContext2D, particles: Particle[], opts: RenderParticleOpts) {
    const {
        showForces,
        showVelocities,
    } = opts;

    ctx.strokeStyle = '#0000FF';
    if (showForces)
        particles.forEach((p) => renderForces(ctx, p, opts));

    ctx.strokeStyle = '#FF0000';
    if (showVelocities)
        particles.forEach((p) => renderVelocities(ctx, p, opts));

    ctx.fillStyle = '#FFFFFF';
    particles.forEach((p) => renderParticleBody(ctx, p, opts));
}