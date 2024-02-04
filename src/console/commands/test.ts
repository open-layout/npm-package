import * as cli from '../cli';

const Command = {
    name: "Test",
    executors: ["test"],
    usage: "test",
    description: "Im just a test command",
    run: async function(args: string[]) {
       cli.dcout(50, 'Consider yourself tested :D')
    }
}

export default Command;