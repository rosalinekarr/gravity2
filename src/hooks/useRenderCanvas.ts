import {RefObject, useEffect} from 'react';

type RenderCallbackFn = (ctx: CanvasRenderingContext2D, ts: DOMHighResTimeStamp) => void;

export default function useRenderCanvas(callbackFn: RenderCallbackFn, ref: RefObject<HTMLCanvasElement>) {
	useEffect(() => {
		if (ref.current === null) return;
		const canvasElement: HTMLCanvasElement = ref.current;
		const ctx = canvasElement.getContext('2d') as CanvasRenderingContext2D;
		let frameId: number;

		function render(timestamp: DOMHighResTimeStamp) {
			callbackFn(ctx, timestamp);
			frameId = window.requestAnimationFrame(render);
		}

		frameId = window.requestAnimationFrame(render);
		return () => { window.cancelAnimationFrame(frameId) };
	}, [ref, callbackFn]);
}