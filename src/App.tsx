import {useEffect, useState} from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  Fab,
  Grid,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import {
  Circle,
  Create,
  Download,
  Grain,
  LinearScale,
  Menu,
  MoreTime,
  Pause,
  PlayArrow,
  Scale,
  Settings,
  Straight,
  Upload,
  VerticalAlignBottom,
} from '@mui/icons-material';
import './App.css';
import Canvas from './components/Canvas';
import {Universe} from './models';

const DEFAULT_GRAVITATIONAL_CONSTANT = 6.674 * (10.0 ** -11);
const DEFAULT_FORCE_LINE_COLOR = '#0000FF';
const DEFAULT_FORCE_LINE_SCALE = 0.1;
const DEFAULT_FORCE_LINE_WIDTH = 1.5;
const DEFAULT_PARTICLE_COLOR = '#FFFFFF';
const DEFAULT_PARTICLE_COUNT = 100;
const DEFAULT_PARTICLE_DENSITY = 1000.0;
const DEFAULT_MASS_RANGE = [100000000.0, 1000000000.0];
const DEFAULT_SCALE = 10.0;
const DEFAULT_TIME_SCALE = 1.0;
const DEFAULT_VELOCITY_LINE_COLOR = '#FF0000';
const DEFAULT_VELOCITY_LINE_SCALE = 10000.0;
const DEFAULT_VELOCITY_LINE_WIDTH = 1.5;

function App() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [forceLineColor, setForceLineColor] = useState(DEFAULT_FORCE_LINE_COLOR);
  const [forceLineScale, setForceLineScale] = useState(DEFAULT_FORCE_LINE_SCALE);
  const [forceLineWidth, setForceLineWidth] = useState(DEFAULT_FORCE_LINE_WIDTH);
  const [gravitationalConstant, setGravitationalConstant] = useState(DEFAULT_GRAVITATIONAL_CONSTANT);
  const [massRange, setMassRange] = useState(DEFAULT_MASS_RANGE);
  const [menuOpen, setMenuOpen] = useState(false);
  const [particleCount, setParticleCount] = useState(DEFAULT_PARTICLE_COUNT);
  const [particleColor, setParticleColor] = useState(DEFAULT_PARTICLE_COLOR);
  const [particleDensity, setParticleDensity] = useState(DEFAULT_PARTICLE_DENSITY);
  const [paused, setPaused] = useState(true);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [showForces, setShowForces] = useState(true);
  const [showScale, setShowScale] = useState(true);
  const [showVelocities, setShowVelocities] = useState(true);
  const [timeScale, setTimeScale] = useState(DEFAULT_TIME_SCALE);
  const [universe, setUniverse] = useState(Universe.generate({
    maxMass: massRange[1],
    minMass: massRange[0],
    particleCount,
  }));
  const [velocityLineColor, setVelocityLineColor] = useState(DEFAULT_VELOCITY_LINE_COLOR);
  const [velocityLineScale, setVelocityLineScale] = useState(DEFAULT_VELOCITY_LINE_SCALE);
  const [velocityLineWidth, setVelocityLineWidth] = useState(DEFAULT_VELOCITY_LINE_WIDTH);

  function handleCreate() {
    setUniverse(Universe.generate({
      maxMass: massRange[1],
      minMass: massRange[0],
      particleCount,
    }));
    setCreateModalOpen(false);
  }

  function handleSaveUniverse() {
    const tempLink = document.createElement('a');
    const data = new Blob([JSON.stringify(universe.serialize())], {type: 'text/json'});
    tempLink.href = URL.createObjectURL(data);
    tempLink.download = `universe-${Date.now()}.json`;
    tempLink.click();
    URL.revokeObjectURL(tempLink.href);
  }

  function handleLoadUniverse() {
    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    tempInput.accept = '.json';
    tempInput.addEventListener('change', (e: Event) => {
      const files = (e.target as HTMLInputElement)?.files || [];
      if (files.length != 1) return;
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setUniverse(
          Universe.deserialize(
            JSON.parse(
              reader.result as string
            )
          )
        );
      });
      reader.readAsText(files[0]);
    });
    tempInput.click();
  }

  useEffect(() => {
    if (paused) return;

    let timeoutId: number | null = null;
    let lastTick: number = Date.now();

    function tick() {
      const now = Date.now();
      const timeDelta = (now - lastTick) * timeScale;

      universe.update(timeDelta, {
        gravitationalConstant,
        particleDensity,
        timeScale,
      });

      lastTick = now;
      timeoutId = setTimeout(tick, 0);
    }

    timeoutId = setTimeout(tick, 0);
    return () => clearTimeout(timeoutId!);
  }, [gravitationalConstant, particleDensity, paused, timeScale, universe]);

  return (
    <Box>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
        <List>
          <ListItem>
            <ListItemButton onClick={() => setCreateModalOpen(true)}>
              <ListItemIcon><Create /></ListItemIcon>
              <ListItemText>New Universe</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
        <List>
          <ListItem>
            <ListItemButton onClick={handleSaveUniverse}>
              <ListItemIcon><Download /></ListItemIcon>
              <ListItemText>Save Universe</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
        <List>
          <ListItem>
            <ListItemButton onClick={handleLoadUniverse}>
              <ListItemIcon><Upload /></ListItemIcon>
              <ListItemText>Load Universe</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
        <List>
          <ListItem>
            <ListItemButton onClick={() => setSettingsModalOpen(true)}>
              <ListItemIcon><Settings /></ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <DialogTitle>New Universe</DialogTitle>
        <DialogContent sx={{width: '50vw'}}>
          <Typography variant="body1" id="particle-count" gutterBottom>Particle Count</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><Grain /></Grid>
            <Grid item xs>
              <Slider aria-labelledby="particle-count-slider" value={particleCount} onChange={(_, newVal: number | number[]) => {if (typeof newVal == 'number') setParticleCount(newVal)}} min={1} max={1000} step={1} />
            </Grid>
            <Grid item>
              <Input value={particleCount} onChange={(e) => setParticleCount(e.target.value === '' ? 0 : Number(e.target.value))} inputProps={{step: 1, min: 1, max: 1000, type: 'number'}} />
            </Grid>
          </Grid>
          <Typography variant="body1" id="mass-range" gutterBottom>Mass Range</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><Scale /></Grid>
            <Grid item xs>
              <Slider aria-labelledby="mass-range-slider" value={massRange} onChange={(_, newVal: number | number[]) => {if (typeof newVal == 'object' && newVal.length == 2) setMassRange(newVal)}} min={0} max={10000} step={1} />
            </Grid>
            <Grid item>
              <Input value={massRange[0]} onChange={(e) => setMassRange([e.target.value === '' ? 0 : Number(e.target.value), massRange[1]])} inputProps={{step: 1, min: 0, max: massRange[1], type: 'number'}} />
              <Typography variant="body1"> - </Typography>
              <Input value={massRange[1]} onChange={(e) => setMassRange([massRange[0], e.target.value === '' ? 0 : Number(e.target.value)])} inputProps={{step: 1, min: massRange[0], max: 10000, type: 'number'}} />
              <Typography variant="body1"> kg</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={settingsModalOpen} onClose={() => setSettingsModalOpen(false)}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent sx={{width: '50vw'}}>
          <Typography variant="body1" id="show-velocity-toggle" gutterBottom>Show Velocities</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><Straight /></Grid>
            <Grid item xs>
              <Switch
                aria-labelledby="show-velocity-toggle"
                checked={showVelocities}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowVelocities(e.target.checked)} />
            </Grid>
          </Grid>
          <Typography variant="body1" id="velocity-line-color" gutterBottom>Velocity Line Color</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><LinearScale /></Grid>
            <Grid item>
              <TextField
                disabled={!showVelocities}
                value={velocityLineColor}
                onChange={(e) => setVelocityLineColor(e.target.value)}
                InputProps={{startAdornment: (
                  <InputAdornment position="start">
                    <Circle sx={{color: velocityLineColor}} />
                  </InputAdornment>
                )}} />
            </Grid>
          </Grid>
          <Typography variant="body1" id="velocity-line-scale" gutterBottom>Velocity Line Scale</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><LinearScale /></Grid>
            <Grid item xs>
              <Slider
                disabled={!showVelocities}
                aria-labelledby="velocity-line-scale-slider"
                value={velocityLineScale}
                onChange={(_, newVal: number | number[]) => {if (typeof newVal == 'number') setVelocityLineScale(newVal)}}
                min={0.01}
                max={10000.0}
                step={0.01}
              />
            </Grid>
            <Grid item>
              <Input disabled={!showVelocities} value={velocityLineScale} onChange={(e) => setVelocityLineScale(e.target.value === '' ? 0 : Number(e.target.value))} inputProps={{step: 0.01, min: 0.01, max: 100.0, type: 'number'}} />
            </Grid>
          </Grid>
          <Typography variant="body1" id="velocity-line-width" gutterBottom>Velocity Line Width</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><LinearScale /></Grid>
            <Grid item xs>
              <Slider
                disabled={!showVelocities}
                aria-labelledby="velocity-line-width-slider"
                value={velocityLineWidth}
                onChange={(_, newVal: number | number[]) => {if (typeof newVal == 'number') setVelocityLineWidth(newVal)}}
                min={0.01}
                max={10.0}
                step={0.01}
              />
            </Grid>
            <Grid item>
              <Input
                disabled={!showVelocities}
                value={velocityLineWidth}
                onChange={(e) => setVelocityLineWidth(e.target.value === '' ? 0 : Number(e.target.value))}
                inputProps={{step: 0.01, min: 0.01, max: 10.0, type: 'number'}}
              />
            </Grid>
          </Grid>
          <Typography variant="body1" id="show-scale-toggle" gutterBottom>Show Scale</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><LinearScale /></Grid>
            <Grid item xs>
              <Switch
                aria-labelledby="show-scale-toggle"
                checked={showScale}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowScale(e.target.checked)}
              />
            </Grid>
          </Grid>
          <Typography variant="body1" id="show-forces-toggle" gutterBottom>Show Forces</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><LinearScale /></Grid>
            <Grid item xs>
              <Switch
                aria-labelledby="show-forces-toggle"
                checked={showForces}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowForces(e.target.checked)}
              />
            </Grid>
          </Grid>
          <Typography variant="body1" id="force-line-color" gutterBottom>Force Line Color</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><LinearScale /></Grid>
            <Grid item>
              <TextField
                disabled={!showForces}
                value={forceLineColor}
                onChange={(e) => setForceLineColor(e.target.value)}
                InputProps={{startAdornment: (
                  <InputAdornment position="start">
                    <Circle sx={{color: forceLineColor}} />
                  </InputAdornment>
                )}} />
            </Grid>
          </Grid>
          <Typography variant="body1" id="force-line-scale" gutterBottom>Force Line Scale</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><LinearScale /></Grid>
            <Grid item xs>
              <Slider
                disabled={!showForces}
                aria-labelledby="force-line-scale-slider"
                value={forceLineScale}
                onChange={(_, newVal: number | number[]) => {if (typeof newVal == 'number') setForceLineScale(newVal)}}
                min={0.01}
                max={100.0}
                step={0.01}
              />
            </Grid>
            <Grid item>
              <Input
                disabled={!showForces}
                value={forceLineScale}
                onChange={(e) => setForceLineScale(e.target.value === '' ? 0 : Number(e.target.value))}
                inputProps={{step: 0.01, min: 0.01, max: 100.0, type: 'number'}}
              />
            </Grid>
          </Grid>
          <Typography variant="body1" id="force-line-width" gutterBottom>Force Line Width</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><LinearScale /></Grid>
            <Grid item xs>
              <Slider
                disabled={!showForces}
                aria-labelledby="force-line-width-slider"
                value={forceLineWidth}
                onChange={(_, newVal: number | number[]) => {if (typeof newVal == 'number') setForceLineWidth(newVal)}}
                min={0.01}
                max={10.0}
                step={0.01}
              />
            </Grid>
            <Grid item>
              <Input
                disabled={!showForces}
                value={forceLineWidth}
                onChange={(e) => setForceLineWidth(e.target.value === '' ? 0 : Number(e.target.value))}
                inputProps={{step: 0.01, min: 0.01, max: 10.0, type: 'number'}}
              />
            </Grid>
          </Grid>
          <Typography variant="body1" id="particle-color" gutterBottom>Particle Color</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><LinearScale /></Grid>
            <Grid item>
              <TextField
                value={particleColor}
                onChange={(e) => setParticleColor(e.target.value)}
                InputProps={{startAdornment: (
                  <InputAdornment position="start">
                    <Circle sx={{color: particleColor}} />
                  </InputAdornment>
                )}} />
            </Grid>
          </Grid>
          <Typography variant="body1" id="particle-density" gutterBottom>Particle Density</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><LinearScale /></Grid>
            <Grid item xs>
              <Slider
                aria-labelledby="particle-density-slider"
                value={particleDensity}
                onChange={(_, newVal: number | number[]) => {if (typeof newVal == 'number') setParticleDensity(newVal)}}
                min={0.01}
                max={100.0}
                step={0.01}
              />
            </Grid>
            <Grid item>
              <Input
                value={particleDensity}
                onChange={(e) => setParticleDensity(e.target.value === '' ? 0 : Number(e.target.value))}
                inputProps={{step: 0.01, min: 0.01, max: 100.0, type: 'number'}}
              />
              <Typography variant="body1"> kg/m^3</Typography>
            </Grid>
          </Grid>
          <Typography variant="body1" id="scale-slider" gutterBottom>Scale</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><LinearScale /></Grid>
            <Grid item xs>
              <Slider
                aria-labelledby="scale-slider"
                value={scale}
                onChange={(_, newVal: number | number[]) => {if (typeof newVal == 'number') setScale(newVal)}}
                min={0.01}
                max={10.0}
                step={0.01}
              />
            </Grid>
            <Grid item>
              <Input
                value={scale}
                onChange={(e) => setScale(e.target.value === '' ? 0 : Number(e.target.value))}
                inputProps={{step: 0.01, min: 0.01, max: 10.0, type: 'number'}}
              />
              <Typography variant="body1"> m/pixel</Typography>
            </Grid>
          </Grid>
          <Typography variant="body1" id="time-scale-slider" gutterBottom>Time Scale</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><MoreTime /></Grid>
            <Grid item xs>
              <Slider
                aria-labelledby="time-scale-slider"
                value={timeScale}
                onChange={(_, newVal: number | number[]) => {if (typeof newVal == 'number') setTimeScale(newVal)}}
                min={-10.0}
                max={10.0}
                step={0.01}
              />
            </Grid>
            <Grid item>
              <Input
                value={timeScale}
                onChange={(e) => setTimeScale(e.target.value === '' ? 0 : Number(e.target.value))}
                inputProps={{step: 0.01, min: -10.0, max: 10.0, type: 'number'}}
              />
            </Grid>
          </Grid>
          <Typography variant="body1" id="gravitational-constant-slider" gutterBottom>Gravitational Constant</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><VerticalAlignBottom /></Grid>
            <Grid item xs>
              <Slider
                aria-labelledby="gravitational-constant-slider"
                value={gravitationalConstant}
                onChange={(_, newVal: number | number[]) => setGravitationalConstant(newVal as number)}
                min={-10.0}
                max={100.0}
                step={0.01}
              />
            </Grid>
            <Grid item>
              <Stack direction="row" alignItems='center'>
                  <Input
                    value={gravitationalConstant / (10 ** Math.floor(Math.log10(gravitationalConstant)))}
                    onChange={(e) => setGravitationalConstant(e.target.value === '' ? gravitationalConstant : Number(e.target.value) * (10 ** Math.floor(Math.log10(gravitationalConstant))))}
                    inputProps={{step: 0.01, min: -20.0, max: 20.0, type: 'number'}}
                  />
                  <Typography variant="body1"> * 10 ^ </Typography>
                  <Input
                    value={Math.floor(Math.log10(gravitationalConstant))}
                    onChange={(e) => setGravitationalConstant(e.target.value === '' ? gravitationalConstant : (gravitationalConstant / (10 ** Math.floor(Math.log10(gravitationalConstant)))) * (10 ** Number(e.target.value)))}
                    inputProps={{step: 1, min: -20.0, max: 20.0, type: 'number'}}
                  />
                  <Typography variant="body1"> Nm^2/kg^2</Typography>
                  </Stack>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Canvas
        universe={universe}
        renderOptions={{
          forceLineColor,
          forceLineScale,
          forceLineWidth,
          particleColor,
          particleDensity,
          scale,
          showForces,
          showScale,
          showVelocities,
          velocityLineColor,
          velocityLineScale,
          velocityLineWidth,
        }}
      />
      <Fab
        sx={{position: 'absolute', top: 16, left: 16}}
        color="primary"
        aria-label="open menu"
        onClick={() => setMenuOpen(true)}
      >
        <Menu />
      </Fab>
      {paused ? (
        <Fab
          sx={{position: 'absolute', bottom: 16, right: 16}}
          color="primary"
          aria-label="play"
          onClick={() => setPaused(false)}
        >
          <PlayArrow />
        </Fab>
      ) : (
        <Fab
          sx={{position: 'absolute', bottom: 16, right: 16}}
          color="primary"
          aria-label="pause"
          onClick={() => setPaused(true)}
        >
          <Pause />
        </Fab>
      )}
    </Box>
  )
}

export default App;
