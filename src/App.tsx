import {useEffect, useState} from 'react';
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
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slider,
  Typography,
} from '@mui/material';
import {
  Create,
  Download,
  Grain,
  Menu,
  Pause,
  PlayArrow,
  Scale,
  Settings,
  Upload,
} from '@mui/icons-material';
import './App.css';
import Canvas from './components/Canvas';
import SettingsDialog from './components/SettingsDialog';
import {useSettings} from './hooks';
import {Universe} from './models';

const DEFAULT_PARTICLE_COUNT = 100;
const DEFAULT_MASS_RANGE = [100000000.0, 1000000000.0];

function App() {
  const {
    gravitationalConstant,
    particleDensity,
    timeScale,
  } = useSettings();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [massRange, setMassRange] = useState(DEFAULT_MASS_RANGE);
  const [menuOpen, setMenuOpen] = useState(false);
  const [particleCount, setParticleCount] = useState(DEFAULT_PARTICLE_COUNT);
  const [paused, setPaused] = useState(true);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [universe, setUniverse] = useState(Universe.generate({
    maxMass: massRange[1],
    minMass: massRange[0],
    particleCount,
  }));

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
      const timeDelta = (now - lastTick);

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
            <ListItemButton onClick={() => setSettingsDialogOpen(true)}>
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
      <SettingsDialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} />
      <Canvas universe={universe} />
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
