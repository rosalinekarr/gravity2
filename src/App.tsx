import { useEffect, useRef, useState } from 'react'
import {Box, Grid, Input, Paper, Slider, Switch, Typography} from '@mui/material';
import {LinearScale, MoreTime, Straight, VerticalAlignBottom} from '@mui/icons-material';
import './App.css'
import useWindowSize from './hooks/useWindowSize';
import {Particle, Vector} from './models';

const PARTICLE_COUNT = 100;
const STANDARD_SCALES = [
  '1 cm',
  '10 cm',
  '1 m',
  '10 m',
  '100 m',
  '1 km',
  '10 km',
  '100 km',
];

function App() {
  const [scale, setScale] = useState(10.0);
  const [timeScale, setTimeScale] = useState(1.0);
  const [gravitationalConstant, setGravitationalConstant] = useState(6.674 * (10.0 ** -11));
  const [particles, _setParticles] = useState(Array.from({length: PARTICLE_COUNT}, (_) => {
    const randPositionRadius = Math.sqrt(Math.random()) * 3000.0;
    const randPositionAngle = Math.random() * Math.PI * 2.0;

    const randVelocityRadius = Math.sqrt(Math.random()) * 1.0;
    const randVelocityAngle = Math.random() * Math.PI * 2.0;

    return new Particle(
      Math.random() ** 2 * (10.0 ** 15),
      new Vector(
        Math.sin(randPositionAngle) * randPositionRadius,
        Math.cos(randPositionAngle) * randPositionRadius,
      ),
      new Vector(
        Math.sin(randVelocityAngle) * randVelocityRadius,
        Math.cos(randVelocityAngle) * randVelocityRadius,
      ),
    );
  }));
  const [width, height] = useWindowSize();
  const [showVelocities, setShowVelocities] = useState(true);
  const [showScale, setShowScale] = useState(true);
  const canvasRef = useRef(null);

  function draw(ctx: CanvasRenderingContext2D, _: DOMHighResTimeStamp) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.strokeStyle = '#FF0000';
    ctx.fillStyle = '#FFFFFF';
    if (showVelocities) particles.forEach((particle) => particle.renderVelocity(ctx, {scale}));
    particles.forEach((particle) => particle.render(ctx, {scale}));

    if (showScale) {
      ctx.font = "10px Roboto";
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#FFFFFF';

      const scaleOrder = Math.floor(Math.log10(scale));
      const scaleFactor = scale / (10.0 ** scaleOrder);

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
  }

  useEffect(() => {
    if (canvasRef.current === null) return;
    const canvasElement = canvasRef.current;
    const ctx = canvasElement.getContext('2d');
    let frameId: number;

    function render(timestamp: DOMHighResTimeStamp) {
      draw(ctx, timestamp);
      frameId = window.requestAnimationFrame(render);
    }

    frameId = window.requestAnimationFrame(render);

    return () => { window.cancelAnimationFrame(frameId) };
  }, [canvasRef, draw]);

  useEffect(() => {
    let gravityTimeoutId: number;
    let lastTimestamp = Date.now();

    function applyGravity() {
      const currentTimestamp = Date.now();

      particles.forEach((pA) =>
        particles.forEach((pB) => {
          const sqrDistance = ((pA.position.x - pB.position.x) ** 2) + ((pA.position.y - pB.position.y) ** 2);
          const distance = Math.sqrt(sqrDistance);
          if (distance < pA.radius() + pB.radius()) return;

          const force = gravitationalConstant * pA.mass * pB.mass / sqrDistance;
          const ddx = (pB.position.x - pA.position.x) * force / distance;
          const ddy = (pB.position.y - pA.position.y) * force / distance;

          pA.applyForce(
            new Vector(ddx, ddy),
            (currentTimestamp - lastTimestamp) * timeScale / 1000.0
          );
        })
      );

      lastTimestamp = currentTimestamp;
      gravityTimeoutId = setTimeout(applyGravity, 0);
    }

    gravityTimeoutId = setTimeout(applyGravity, 0);

    return () => {clearTimeout(gravityTimeoutId);};
  }, [gravitationalConstant, particles, timeScale]);
  
  useEffect(() => {
    let positionTimeoutId: number;
    let lastTimestamp = Date.now();

    function updatePositions() {
      const currentTimestamp = Date.now();

      particles.forEach((particle) => particle.move((currentTimestamp - lastTimestamp) * timeScale / 1000.0));

      lastTimestamp = currentTimestamp;
      positionTimeoutId = setTimeout(updatePositions, 0);
    }

    positionTimeoutId = setTimeout(updatePositions, 0);

    return () => {clearTimeout(positionTimeoutId);};
  }, [particles, timeScale]);

  return (
    <Box>
      <Paper sx={{textAlign: 'left', position: 'absolute', top: 10, left: 10, width: 300, p: 2}}>
        <Typography id="show-velocity-toggle" gutterBottom>Show Velocities</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item><Straight /></Grid>
          <Grid item xs>
            <Switch aria-labelledby="show-velocity-toggle" checked={showVelocities} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowVelocities(e.target.checked)} />
          </Grid>
        </Grid>
        <Typography id="show-scale-toggle" gutterBottom>Show Scale</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item><LinearScale /></Grid>
          <Grid item xs>
            <Switch aria-labelledby="show-scale-toggle" checked={showScale} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowScale(e.target.checked)} />
          </Grid>
        </Grid>
        <Typography id="scale-slider" gutterBottom>Scale</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item><LinearScale /></Grid>
          <Grid item xs>
            <Slider mh={10} aria-labelledby="scale-slider" value={scale} onChange={(_, newVal: number) => setScale(newVal)} scale={(s) => 10.0 ** s} min={0.01} max={1000.0} step={0.01} />
          </Grid>
          <Grid item>
            <Input value={scale} onChange={(e) => setScale(e.target.value === '' ? 0 : Number(e.target.value))} inputProps={{step: 0.01, min: 0.01, max: 1000.0, type: 'number'}} /> m/pixel
          </Grid>
        </Grid>
        <Typography id="time-scale-slider" gutterBottom>Time Scale</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item><MoreTime /></Grid>
          <Grid item xs>
            <Slider mh={10} aria-labelledby="time-scale-slider" value={timeScale} onChange={(_, newVal: number) => setTimeScale(newVal)} min={-10.0} max={10.0} step={0.01} />
          </Grid>
          <Grid item>
            <Input value={timeScale} onChange={(e) => setTimeScale(e.target.value === '' ? 0 : Number(e.target.value))} inputProps={{step: 0.01, min: -10.0, max: 10.0, type: 'number'}} /> s/s
          </Grid>
        </Grid>
        <Typography id="gravitational-constant-slider" gutterBottom>Gravitational Constant</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item><VerticalAlignBottom /></Grid>
          <Grid item xs>
            <Slider mh={10} aria-labelledby="gravitational-constant-slider" value={gravitationalConstant} onChange={(_, newVal: number) => setGravitationalConstant(newVal)} min={-10.0} max={100.0} step={0.01} />
          </Grid>
          <Grid item>
            <Input value={gravitationalConstant} onChange={(e) => setGravitationalConstant(e.target.value === '' ? 0 : Number(e.target.value))} inputProps={{step: 0.01, min: -10.0, max: 100.0, type: 'number'}} />
          </Grid>
        </Grid>
      </Paper>
      <canvas ref={canvasRef} width={width} height={height}>Your browser is not supported. Please try another.</canvas>
    </Box>
  )
}

export default App
