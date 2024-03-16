import {useState} from 'react';
import {
	Drawer,
	Fab,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import {
	Create,
	Download,
	Menu,
	Settings,
	Upload,
} from '@mui/icons-material';
import NewUniverseDialog from './NewUniverseDialog';
import SettingsDialog from './SettingsDialog';
import {useUniverse} from '../hooks';
import { UniverseGenerateOptions } from '../models';

export default function MainMenu() {
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
	const {createUniverse, saveUniverse, loadUniverse} = useUniverse();
    
	function handleCreate(opts: UniverseGenerateOptions) {
		createUniverse(opts);
		setCreateModalOpen(false);
		setMenuOpen(false);
	}

	function handleSave() {
		saveUniverse();
		setMenuOpen(false);
	}

	function handleLoad() {
		loadUniverse();
		setMenuOpen(false);
	}

	return (
		<>
			<Fab
				sx={{position: 'absolute', top: 16, left: 16}}
				color="primary"
				aria-label="open menu"
				onClick={() => setMenuOpen(true)}
			>
				<Menu />
			</Fab>
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
						<ListItemButton onClick={handleSave}>
							<ListItemIcon><Download /></ListItemIcon>
							<ListItemText>Save Universe</ListItemText>
						</ListItemButton>
					</ListItem>
				</List>
				<List>
					<ListItem>
						<ListItemButton onClick={handleLoad}>
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
			<NewUniverseDialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} onCreate={handleCreate} />
			<SettingsDialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} />
		</>
	);
}