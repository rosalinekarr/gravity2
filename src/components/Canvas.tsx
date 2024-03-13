import { useCallback, useEffect, useRef } from 'react';
import {useSettings, useWindowSize} from '../hooks';
import Universe from '../models/universe';
import {renderBackground, renderForces, renderParticles, renderScale} from '../renderers';

interface CanvasProps {
    universe: Universe;
}

function Canvas({universe}: CanvasProps) {
	const settings = useSettings();
	const [width, height] = useWindowSize();
	const canvasRef = useRef(null);

	const draw = useCallback((ctx: CanvasRenderingContext2D, _timestamp: DOMHighResTimeStamp) => {
		renderBackground(ctx);
		renderParticles(ctx, universe.particles, settings);
		if (settings.showForces) renderForces(ctx, universe.forces, universe.particles, settings);
		renderScale(ctx, settings);
	}, [settings, universe]);

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