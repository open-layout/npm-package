import kleur from 'kleur';
import * as cli from './cli'

const packageName = 'Your Package Name';
const packageVersion = '1.0.0';
const packageTemplates = '3 Templates';

function _render_header(): void {
	cli.clear();
	
	const terminalWidth = process.stdout.columns || 80;
	
	const availableSpace = terminalWidth - packageTemplates.length - packageName.length - packageVersion.length - 6; // Adjust for padding and separators
	
	if (availableSpace < 0)
		return;

	const padding = Math.floor(availableSpace / 2);
	
	const output = kleur.bgCyan(
		kleur.white().italic(
			`${packageTemplates.padEnd(padding + packageTemplates.length)}  ${kleur.bold(packageName)}  ${packageVersion.padStart(padding + packageVersion.length)}`
			)
	)
	process.stdout.write(output.padStart(4))
	process.stdout.write('\n')
}

export function logo(): void {
	_render_header();

	cli.cout(`
		
	
		Open Layout


	`)
}