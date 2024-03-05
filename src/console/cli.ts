import kleur from 'kleur';
import readlineSync from 'readline-sync';

export function cout(...text: string[]): void {
	console.log(...text)
}

export function dcout(delay: number, text: string): void {
	for (let i = 0; i < text.length; i++)
		setTimeout(() => process.stdout.write(text[i]), delay * i)

	process.stdout.write('\n');
}

export function pcout(prefix: string, text: string): void {
	prefix = prefix.toLowerCase();
	if (
		process.env.NODE_ENV !== "development" &&
		prefix === "debug" || prefix === "errord"
		) return;

	switch (prefix.toLowerCase()) {
		case "info":
			prefix = kleur.bgBlue().white(`[${prefix}]`)
			break;
		case "debug":
			prefix = kleur.bgCyan().white(`[${prefix}]`)
			break;
		case "warn":
			prefix = kleur.bgYellow().white(`[${prefix}]`)
			break;
		case "error":
			prefix = kleur.bgRed().white(`[${prefix}]`)
			break;
		default:
			prefix = kleur.bgWhite().black(`[${prefix}]`)
			break;
	}
	const str = kleur.bold(`${prefix} ${kleur.white().italic(text)}`)
	cout(str)
}

export function clear_lines(num: number = 1): void {
	for (let i = 0; i < num; i++) 
        process.stdout.write('\u001b[1A\u001b[2K');
}

export function clear(): void {
	process.stdout.write('\u001B[2J\u001B[0;0f');
}

export function cin(message: string = ''): string {
	if (!message)
		readlineSync.keyInPause(message);
	
	return readlineSync.question(message);
}