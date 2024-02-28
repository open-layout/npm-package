import { Globals } from "../globals/globals";
import * as std from '../console/cli'

const get_explore = async (): Promise<Array<any>> => {
    const axios = Globals.axios();

    var response: Array<any> = [];

    try {
        const res = await axios.get('/templates/explore')

        if (res && res.data.success)
            response = res.data.results;
    } catch (error) {
        std.pcout('ERRORD', `Failed to request get_explore() got ${error}`);
    }

    return response;
}

const get_find = async (query: string): Promise<Array<any>> => {
    const axios = Globals.axios();

    var response: Array<any> = [];

    try {
        const res = await axios.get('/templates/find?query=' + query)

        if (res && res.data.success)
            response = res.data.results;
    } catch (error) {
        std.pcout('ERRORD', `Failed to request get_find() got ${error}`);
    }

    return response;
}

const get_stats = async (): Promise<object | any> => {
    const axios = Globals.axios();

    var response: object = {};

    try {
        const res = await axios.get('/templates/statistics')

        if (res && res.data.success)
            response = res.data.data;
    } catch (error) {
        std.pcout('ERRORD', `Failed to request get_stats() got ${error}`);
    }

    return response;
}

const get_layout = async (layout_name: string): Promise<object | any> => {
    const axios = Globals.axios();

    var response: object = {};

    try {
        const res = await axios.post('/templates/layout', { name: layout_name })

        if (res && res.data.success)
            response = res.data.data;
    } catch (error) {
        std.pcout('ERRORD', `Failed to request get_layout() got ${error}`);
    }

    return response;
}

export { get_explore, get_find, get_stats, get_layout }; 