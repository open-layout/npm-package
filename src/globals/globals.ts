interface Globals {
    system: string;
    package: {
        name: string;
        version: string;
        description: string;
        homepage: string;
        // Add other properties if needed
    } | null;
    api_url: string;
}

const globals: Globals  = {
	system: String(),
	package:  null,
	api_url: process.env.API_URL || 'https://api.openlayout.me',
};

export function get_package() {
	const path = process.env.npm_package_json
	if (path) 
		return globals.package = require(path)
}

export default globals;