import { Globals } from "../globals/globals";
import * as std from '../console/cli'

const get_layouts = async (): Promise<Array<any>> => {
    const axios = Globals.axios();

    var response: Array<any> = [];

    try {
        const res = await axios.get('/templates/explore')

        if (res && res.data.success)
            response = res.data.results;
    } catch (error) {
        std.pcout('ERROR', `Failed to request get_layouts() got ${error}`);
    }

    return response;
}


export { get_layouts }; 