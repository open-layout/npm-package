import { get_package } from './utilities';

class Globals {
	// Class properties
	private static _package: object | any;

	// Class methods
	/**
	 * package()
	 * @returns {object} With the package informatio
	 */
	static package() {
		if (!this._package)
			this._package = get_package();

		return this._package;
	}

}

export { Globals };