interface RenderScaleOpts {
    scale?: number;
    showScale?: boolean;
}

const DEFAULT_SCALE = 1.0;
const STANDARD_SCALES = [
  '1 cm',
  '10 cm',
  '1 m',
  '10 m',
  '100 m',
  '1 km',
  '10 km',
  '100 km',
  '1 Mm',
  '10 Mm',
  '100 Mm',
  '1 Gm',
  '10 Gm',
  '100 Gm',
  '1 Tm',
  '10 Tm',
  '100 Tm',
  '1 Pm',
  '10 Pm',
  '100 Pm',
];

function getScale(opts: RenderScaleOpts) {
    return opts.scale || DEFAULT_SCALE;
}

export default function renderScale(ctx: CanvasRenderingContext2D, opts: RenderScaleOpts) {
    if (!opts.showScale) return;
        ctx.font = "10px Roboto";
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#FFFFFF';
  
        const scaleOrder = Math.floor(Math.log10(getScale(opts)));
        const scaleFactor = getScale(opts) / (10.0 ** scaleOrder);
  
        ctx.fillText(STANDARD_SCALES[scaleOrder + 4], 110 + 100 / scaleFactor, ctx.canvas.height - 100);
  
        ctx.beginPath();
        ctx.moveTo(100, ctx.canvas.height - 110);
        ctx.lineTo(100, ctx.canvas.height - 90);
        ctx.lineTo(100, ctx.canvas.height - 100);
  
        if (scaleFactor < 7.5) {
          for (let i = 10; i < 100; i += 10) {
            ctx.lineTo(100 + i / scaleFactor, ctx.canvas.height - 100);
            ctx.lineTo(100 + i / scaleFactor, ctx.canvas.height - 95);
            ctx.lineTo(100 + i / scaleFactor, ctx.canvas.height - 105);
            ctx.lineTo(100 + i / scaleFactor, ctx.canvas.height - 100);
          }
        }
  
        ctx.lineTo(100 + 100 / scaleFactor, ctx.canvas.height - 100);
        ctx.lineTo(100 + 100 / scaleFactor, ctx.canvas.height - 90);
        ctx.lineTo(100 + 100 / scaleFactor, ctx.canvas.height - 110);
        ctx.stroke();
}