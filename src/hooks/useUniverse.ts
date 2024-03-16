import {useContext} from 'react';
import UniverseContext from '../contexts/universe';
import {Universe, UniverseGenerateOptions} from '../models';

export default function useUniverse() {
	const universeContext = useContext(UniverseContext);
	if (!universeContext) throw new Error('Missing Universe Provider');

	const {
		selectedParticles,
		setSelectedParticles,
		setUniverse,
		universe,
	} = universeContext;

	function createUniverse(opts: UniverseGenerateOptions) {
		setUniverse(Universe.generate(opts));
	}

	function saveUniverse() {
		const tempLink = document.createElement('a');
		const data = new Blob([JSON.stringify(universe.serialize())], {type: 'text/json'});
		tempLink.href = URL.createObjectURL(data);
		tempLink.download = `universe-${Date.now()}.json`;
		tempLink.click();
		URL.revokeObjectURL(tempLink.href);
	}

	function loadUniverse() {
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

	return {
		createUniverse,
		saveUniverse,
		loadUniverse,
		universe,
		selectedParticles,
		setSelectedParticles,
	};
}