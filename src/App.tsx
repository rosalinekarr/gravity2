import {useEffect, useState} from 'react'
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, Fab, Grid, Input, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Slider, Stack, Switch, Typography} from '@mui/material';
import {Create, Download, Grain, LinearScale, Menu, MoreTime, Pause, PlayArrow, Settings, Straight, Upload, VerticalAlignBottom} from '@mui/icons-material';
import './App.css';
import Canvas from './components/Canvas';
import {Universe} from './models';

const DEFAULT_GRAVITATIONAL_CONSTANT = 6.674 * (10.0 ** -11);
const DEFAULT_PARTICLE_COUNT = 100;
const DEFAULT_SCALE = 5.0;
const DEFAULT_TIME_SCALE = 1.0;

function App() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [gravitationalConstant, setGravitationalConstant] = useState(DEFAULT_GRAVITATIONAL_CONSTANT);
  const [menuOpen, setMenuOpen] = useState(false);
  const [particleCount, setParticleCount] = useState(DEFAULT_PARTICLE_COUNT);
  const [paused, setPaused] = useState(true);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [showForces, setShowForces] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const [showVelocities, setShowVelocities] = useState(false);
  const [timeScale, setTimeScale] = useState(DEFAULT_TIME_SCALE);
  const [universe, setUniverse] = useState(Universe.generate({particleCount}));

  function handleCreate() {
    setUniverse(Universe.generate({particleCount}));
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
        timeScale,
      });

      lastTick = now;
      timeoutId = setTimeout(tick, 0);
    }

    timeoutId = setTimeout(tick, 0);
    return () => clearTimeout(timeoutId!);
  }, [gravitationalConstant, paused, timeScale, universe]);

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
              <Switch aria-labelledby="show-velocity-toggle" checked={showVelocities} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowVelocities(e.target.checked)} />
            </Grid>
          </Grid>
          <Typography variant="body1" id="show-scale-toggle" gutterBottom>Show Scale</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><LinearScale /></Grid>
            <Grid item xs>
              <Switch aria-labelledby="show-scale-toggle" checked={showScale} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowScale(e.target.checked)} />
            </Grid>
          </Grid>
          <Typography variant="body1" id="show-forces-toggle" gutterBottom>Show Forces</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><LinearScale /></Grid>
            <Grid item xs>
              <Switch aria-labelledby="show-forces-toggle" checked={showForces} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowForces(e.target.checked)} />
            </Grid>
          </Grid>
          <Typography variant="body1" id="scale-slider" gutterBottom>Scale</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><LinearScale /></Grid>
            <Grid item xs>
              <Slider aria-labelledby="scale-slider" value={scale} onChange={(_, newVal: number | number[]) => {if (typeof newVal == 'number') setScale(newVal)}} min={0.01} max={10.0} step={0.01} />
            </Grid>
            <Grid item>
              <Input value={scale} onChange={(e) => setScale(e.target.value === '' ? 0 : Number(e.target.value))} inputProps={{step: 0.01, min: 0.01, max: 10.0, type: 'number'}} /> m/pixel
            </Grid>
          </Grid>
          <Typography variant="body1" id="time-scale-slider" gutterBottom>Time Scale</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><MoreTime /></Grid>
            <Grid item xs>
              <Slider aria-labelledby="time-scale-slider" value={timeScale} onChange={(_, newVal: number | number[]) => {if (typeof newVal == 'number') setTimeScale(newVal)}} min={-10.0} max={10.0} step={0.01} />
            </Grid>
            <Grid item>
              <Input value={timeScale} onChange={(e) => setTimeScale(e.target.value === '' ? 0 : Number(e.target.value))} inputProps={{step: 0.01, min: -10.0, max: 10.0, type: 'number'}} /> s/s
            </Grid>
          </Grid>
          <Typography variant="body1" id="gravitational-constant-slider" gutterBottom>Gravitational Constant</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item><VerticalAlignBottom /></Grid>
            <Grid item xs>
              <Slider aria-labelledby="gravitational-constant-slider" value={gravitationalConstant} onChange={(_, newVal: number | number[]) => setGravitationalConstant(newVal as number)} min={-10.0} max={100.0} step={0.01} />
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
                  </Stack>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Canvas universe={universe} scale={scale} showForces={showForces} showScale={showScale} showVelocities={showVelocities} />
      <Fab sx={{position: 'absolute', top: 16, left: 16}} color="primary" aria-label="open menu" onClick={() => setMenuOpen(true)}><Menu /></Fab>
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
