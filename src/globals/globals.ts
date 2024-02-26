import axios, { Axios, AxiosInstance } from 'axios';
import config from './config';
import { get_package } from './utilities';

class Globals {
	// Class properties
	private static _package: object | any;
    private static _axios: AxiosInstance;

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

    static axios() {
        if (!this._axios)
            this._axios = axios.create({
                baseURL: config.api,
                timeout: 2000,
                headers: config.headers
              });

        return this._axios;
    }
}

export { Globals };