import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import {useSettings, useWindowSize} from '../hooks';
import {Particle, Universe, Vector} from '../models';
import {renderBackground, renderForces, renderParticles, renderScale, renderSelectedParticles} from '../renderers';

interface CanvasProps {
    universe: Universe;
	onSelect: (particles: Particle[]) => void;
	selectedParticles: Particle[];
}

function Canvas({universe, onSelect, selectedParticles}: CanvasProps) {
	const settings = useSettings();
	const [width, height] = useWindowSize();
	const [offsetX, setOffsetX] = useState<number>(0.0);
	const [offsetY, setOffsetY] = useState<number>(0.0);
	const [scale, setScale] = useState<number>(0.1);
	const [isScaling, setIsScaling] = useState<boolean>(false);
	const canvasRef = useRef(null);

	const draw = useCallback((ctx: CanvasRenderingContext2D, _timestamp: DOMHighResTimeStamp) => {
		const offset = new Vector(offsetX * scale + width/2, offsetY * scale + height/2);
		renderBackground(ctx);

		ctx.save();
		ctx.translate(offset.x, offset.y);
		ctx.scale(scale, scale);

		renderParticles(ctx, universe.particles, settings);

		ctx.restore();

		renderSelectedParticles(ctx, selectedParticles, offset, scale, settings);
		if (settings.showForces) renderForces(ctx, universe.forces, universe.particles, offset, scale);

		renderScale(ctx, scale, settings);
	}, [height, offsetX, offsetY, scale, selectedParticles, settings, universe, width]);

	const handleClick: MouseEventHandler = useCallback((e) => {
		onSelect(
			universe.selectParticles(
				(e.clientX - ((offsetX * scale) + width/2)) / scale,
				(e.clientY - ((offsetY * scale) + height/2)) / scale,
			)
		);
	}, [height, offsetX, offsetY, onSelect, scale, universe, width]);

	useEffect(() => {
		function handleWheelEvent(e: WheelEvent) {
			setOffsetX((prevX: number) => prevX - (e.deltaX / scale));
			if (isScaling) {
				setScale((prevScale: number) => prevScale * (10 ** (e.deltaY * settings.scaleRate)));
			} else {
				setOffsetY((prevY: number) => prevY - (e.deltaY / scale));
			}
		}

		document.addEventListener('wheel', handleWheelEvent);
		return () => document.removeEventListener('wheel', handleWheelEvent);
	}, [isScaling, scale, settings]);

	useEffect(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.shiftKey) setIsScaling(true);
		}

		function handleKeyup(e: KeyboardEvent) {
			if (!e.shiftKey) setIsScaling(false);
		}

		document.addEventListener('keydown', handleKeydown);
		document.addEventListener('keyup', handleKeyup);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('keyup', handleKeyup);
		};
	}, []);

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