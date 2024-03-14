import { MouseEventHandler, useCallback, useEffect, useRef } from 'react';
import {useSettings, useWindowSize} from '../hooks';
import {Particle, Universe} from '../models';
import {renderBackground, renderForces, renderParticles, renderScale} from '../renderers';

interface CanvasProps {
    universe: Universe;
	onSelect: (particles: Particle[]) => void;
	selectedParticles: Particle[];
}

function Canvas({universe, onSelect, selectedParticles}: CanvasProps) {
	const settings = useSettings();
	const [width, height] = useWindowSize();
	const canvasRef = useRef(null);

	const draw = useCallback((ctx: CanvasRenderingContext2D, _timestamp: DOMHighResTimeStamp) => {
		renderBackground(ctx);
		renderParticles(ctx, universe.particles, selectedParticles, settings);
		if (settings.showForces) renderForces(ctx, universe.forces, universe.particles, settings);
		renderScale(ctx, settings);
	}, [selectedParticles, settings, universe]);

	const handleClick: MouseEventHandler = useCallback((e) => {
		onSelect(
			universe.selectParticles(
				(e.clientX - width/2) * settings.scale,
				(e.clientY - height/2) * settings.scale,
			)
		);
	}, [height, onSelect, settings, universe, width]);

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

	return (
		<canvas
			ref={canvasRef}
			width={width}
			height={height}
			onClick={handleClick}
		>
			Your browser is not supported. Please try another.
		</canvas>
	);
}

export default Canvas;