import * as cli from '../cli';

exports.default = {
    name: "Test",
    executors: ["test", "--test"],
    usage: "test",
    description: "Im just a test command",
    run: async function(args: string[]) {
       cli.dcout(100, 'Consider yourself tested :D')
    }
}