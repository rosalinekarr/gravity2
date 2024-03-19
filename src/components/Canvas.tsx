import { KeyboardEvent, MouseEvent, WheelEvent, useEffect, useRef, useState } from 'react';
import {useSettings, useTimeScale, useUniverse, useWindowSize} from '../hooks';
import {Vector} from '../models';
import {renderBackground, renderForces, renderParticles, renderScale, renderSelectedParticles} from '../renderers';
import useRenderCanvas from '../hooks/useRenderCanvas';

function Canvas() {
	const {selectedParticles, setSelectedParticles, universe} = useUniverse();
	const settings = useSettings();
	const [_timeScale, setTimeScale] = useTimeScale();
	const [width, height] = useWindowSize();
	const [offset, setOffset] = useState<Vector>(new Vector(0.0, 0.0));
	const [scale, setScale] = useState<number>(0.1);
	const [isScaling, setIsScaling] = useState<boolean>(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	function handleClick(e: MouseEvent<HTMLCanvasElement>) {
		setSelectedParticles(
			universe.selectParticles(
				(e.clientX - ((offset.x * scale) + width/2)) / scale,
				(e.clientY - ((offset.y * scale) + height/2)) / scale,
			)
		);
	}

	function handleWheel(e: WheelEvent<HTMLCanvasElement>) {
		if (isScaling) {
			setScale((prevScale: number) => prevScale * (10 ** (e.deltaY * settings.scaleRate)));
		} else {
			setOffset((prevVector: Vector) =>
				new Vector(
					prevVector.x - (e.deltaX / scale),
					prevVector.y - (e.deltaY / scale),
				)
			);
		}
	}

	function handleKeyDown(e: KeyboardEvent<HTMLCanvasElement>) {
		if (e.shiftKey && !e.repeat) setIsScaling(true);
		if (e.code === 'Space' && !e.repeat) setTimeScale((prevTimeScale) => (prevTimeScale === 0.0 ? 1.0 : 0.0));
	}

	function handleKeyUp(e: KeyboardEvent<HTMLCanvasElement>) {
		if (!e.shiftKey) setIsScaling(false);
	}

	useRenderCanvas((ctx, _ts) => {
		const screenOffset = new Vector(
			offset.x * scale + width/2,
			offset.y * scale + height/2,
		);
		renderBackground(ctx);

		ctx.save();
		ctx.translate(screenOffset.x, screenOffset.y);
		ctx.scale(scale, scale);

		renderParticles(ctx, universe.particles, settings);

		ctx.restore();

		renderSelectedParticles(ctx, selectedParticles, screenOffset, scale, settings);
		if (settings.showForces) renderForces(ctx, universe.forces, universe.particles, screenOffset, scale);

		renderScale(ctx, scale, settings);
	}, canvasRef);

	useEffect(() => {
		if (canvasRef.current) canvasRef.current.focus();
	}, []);

	return (
		<canvas
			style={{outline: 'none'}}
			ref={canvasRef}
			width={width}
			height={height}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			onKeyUp={handleKeyUp}
			onWheel={handleWheel}
			tabIndex={0}
		>
			Your browser is not supported. Please try another.
		</canvas>
	);
}

export default Canvas;