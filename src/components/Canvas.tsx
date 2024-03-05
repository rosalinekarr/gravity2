import { useEffect, useRef } from 'react'
import useWindowSize from '../hooks/useWindowSize';
import Universe from '../models/universe';
import type {RenderParticleOpts} from '../renderers/particle';
import type {RenderScaleOpts} from '../renderers/scale';
import {renderBackground, renderParticles, renderScale} from '../renderers';

type RenderOptions = RenderParticleOpts & RenderScaleOpts;

interface CanvasProps {
    renderOptions: RenderOptions;
    universe: Universe;
}

function Canvas({universe, renderOptions}: CanvasProps) {
  const [width, height] = useWindowSize();
  const canvasRef = useRef(null);

  function draw(ctx: CanvasRenderingContext2D, _timestamp: DOMHighResTimeStamp) {
    renderBackground(ctx);
    renderParticles(ctx, universe.particles, renderOptions);
    renderScale(ctx, renderOptions);
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