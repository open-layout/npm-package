import kleur from 'kleur';
import List from 'enquirer';

export function cout(...text: string[]): void {
	console.log(...text)
}

export function dcout(delay: number, text: string): void {
	for (let i = 0; i < text.length; i++)
		setTimeout(() => process.stdout.write(text[i]), delay * i)

	process.stdout.write('\n');
}

export function pcout(prefix: string, text: string): void {
	const str = kleur.bold(`${ kleur.white().bgCyan(`[${prefix}]`) } ${ kleur.white().italic(text)}`)
	console.log(str)
}

export function clear(): void {
	process.stdout.write('\u001B[2J\u001B[0;0f');
}

const packageName = 'Your Package Name';
const packageVersion = '1.0.0';
const packageTemplates = '3 Templates';

export function _render_header(): void {
	clear();
	
	const terminalWidth = process.stdout.columns || 80;
	
	// Calculate the available space for the text
	const availableSpace = terminalWidth - packageTemplates.length - packageName.length - packageVersion.length - 6; // Adjust for padding and separators
	
	// Calculate the padding for even distribution
	const padding = Math.floor(availableSpace / 2);
	
	// Output the header
	const output = kleur.bgCyan(
		kleur.white().italic(
			`${packageTemplates.padEnd(padding + packageTemplates.length)}  ${kleur.bold(packageName)}  ${packageVersion.padStart(padding + packageVersion.length)}`
			)
	)
	process.stdout.write(output.padStart(4))
	process.stdout.write('\n')
  }



export function showMainMenu(): void {
	_render_header();

	cout(`
	
.|''''|,                         '||                                        ||          
||    ||                          ||                                        ||          
||    || '||''|, .|''|, \`||''|,   ||      '''|.  '||  ||\` .|''|, '||  ||\` ''||''  ('''' 
||    ||  ||  || ||..||  ||  ||   ||     .|''||   \`|..||  ||  ||  ||  ||    ||     \`'') 
\`|....|'  ||..|' \`|...  .||  ||. .||...| \`|..||.      ||  \`|..|'  \`|..'|.   \`|..' \`...' 
          ||                                       ,  |'                                
         .||                                        ''                                  

	`)
}

export function helpMenu(): void {
	_render_header();

	const prompt = new List({
		name: 'keywords',
		message: 'Type comma-separated keywords'
	});
}