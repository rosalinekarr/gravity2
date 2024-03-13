export default function renderBackground(ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = '#000000';
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}