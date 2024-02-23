import Vector from './vector';

interface ParticleRenderOpts {
    scale: number;
}

export default class Particle {
    position: Vector;
    velocity: Vector;
    mass: number;

    constructor(mass: number, position: Vector, velocity: Vector) {
        this.mass = mass;
        this.position = position;
        this.velocity = velocity;
    }

    move(timeDelta: number) {
        this.position = new Vector(
            this.position.x + this.velocity.x * timeDelta,
            this.position.y + this.velocity.y * timeDelta,
        );
    }

    applyForce(force: Vector, timeDelta: number) {
        this.velocity = new Vector(
            this.velocity.x + force.x * timeDelta / this.mass,
            this.velocity.y + force.y * timeDelta / this.mass,
        );
    }

    radius() {
        return (10.0 ** -5.7) * Math.sqrt(this.mass);
    }

    render(ctx: CanvasRenderingContext2D, opts: ParticleRenderOpts) {
        const radius = this.radius() / opts.scale;
        const scrnX = (this.position.x / opts.scale) + (ctx.canvas.width/2);
        const scrnY = (this.position.y / opts.scale) + (ctx.canvas.height/2);
    
        ctx.beginPath();
        ctx.arc(scrnX, scrnY, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    renderVelocity(ctx: CanvasRenderingContext2D, opts: ParticleRenderOpts) {
        const radius = this.radius() / opts.scale;
        const scrnX = (this.position.x / opts.scale) + (ctx.canvas.width/2);
        const scrnY = (this.position.y / opts.scale) + (ctx.canvas.height/2);

        ctx.beginPath();
        ctx.moveTo(scrnX, scrnY);
        ctx.lineTo(scrnX + this.velocity.x * 10.0 / opts.scale, scrnY + this.velocity.y * 10.0 / opts.scale);
        ctx.stroke();
    }
}