export interface RenderScaleOpts {
	font: string;
    showScale?: boolean;
}

const STANDARD_SCALES = [
	'100 Pm',
	'10 Pm',
	'1 Pm',
	'100 Tm',
	'10 Tm',
	'1 Tm',
	'100 Gm',
	'10 Gm',
	'1 Gm',
	'100 Mm',
	'10 Mm',
	'1 Mm',
	'100 km',
	'10 km',
	'1 km',
	'100 m',
	'10 m',
	'1 m',
	'10 cm',
	'1 cm',
];

export default function renderScale(ctx: CanvasRenderingContext2D, scale: number, opts: RenderScaleOpts) {
	if (!opts.showScale) return;
	ctx.font = opts.font;
	ctx.fillStyle = '#FFFFFF';
	ctx.strokeStyle = '#FFFFFF';
	ctx.lineWidth = 1.0;
  
	const scaleOrder = Math.floor(Math.log10(scale));
	const scaleFactor = scale / (10.0 ** scaleOrder);
  
	ctx.beginPath();
	ctx.moveTo(ctx.canvas.width - 200, ctx.canvas.height - 110);
	ctx.lineTo(ctx.canvas.width - 200, ctx.canvas.height - 90);
	ctx.lineTo(ctx.canvas.width - 200, ctx.canvas.height - 100);
  
	if (scaleFactor > 2.5) {
		for (let i = 1; i < 10; i += 1) {
			ctx.lineTo(ctx.canvas.width - 200 + i * scaleFactor, ctx.canvas.height - 100);
			ctx.lineTo(ctx.canvas.width - 200 + i * scaleFactor, ctx.canvas.height - 95);
			ctx.lineTo(ctx.canvas.width - 200 + i * scaleFactor, ctx.canvas.height - 105);
			ctx.lineTo(ctx.canvas.width - 200 + i * scaleFactor, ctx.canvas.height - 100);
		}
	}
  
	ctx.lineTo(ctx.canvas.width - 200 + 10 * scaleFactor, ctx.canvas.height - 100);
	ctx.lineTo(ctx.canvas.width - 200 + 10 * scaleFactor, ctx.canvas.height - 90);
	ctx.lineTo(ctx.canvas.width - 200 + 10 * scaleFactor, ctx.canvas.height - 110);
	ctx.stroke();
  
	ctx.fillText(STANDARD_SCALES[scaleOrder + 17], ctx.canvas.width - 190 + 10 * scaleFactor, ctx.canvas.height - 100);
}