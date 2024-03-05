import { useEffect, useRef } from 'react'
import useWindowSize from '../hooks/useWindowSize';
import Universe from '../models/universe';
import {renderBackground, renderParticles, renderScale} from '../renderers';

interface CanvasProps {
    scale: number;
    showForces: boolean;
    showScale: boolean;
    showVelocities: boolean;
    universe: Universe;
}

function Canvas({universe, scale, showForces, showScale, showVelocities}: CanvasProps) {
  const [width, height] = useWindowSize();
  const canvasRef = useRef(null);

  function draw(ctx: CanvasRenderingContext2D, _: DOMHighResTimeStamp) {
    renderBackground(ctx);
    renderParticles(ctx, universe.particles, {scale, showForces, showVelocities});
    renderScale(ctx, {scale, showScale});
  }

  useEffect(() => {
    if (canvasRef.current === null) return;
    const canvasElement: HTMLCanvasElement = canvasRef.current;
    const ctx = canvasElement.getContext('2d') as CanvasRenderingContext2D;
    let frameId: number;

    function render(timestamp: DOMHighResTimeStamp) {
      draw(ctx, timestamp);
      frameId = window.requestAnimationFrame(render);
    }

    frameId = window.requestAnimationFrame(render);

    return () => { window.cancelAnimationFrame(frameId) };
  }, [canvasRef, draw]);

  return <canvas ref={canvasRef} width={width} height={height}>Your browser is not supported. Please try another.</canvas>
}

export default Canvas;