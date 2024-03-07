"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const package_json_1 = __importDefault(require("../package.json"));
console.log('Updating package.json data...');
let config = fs_1.default.readFileSync(__dirname + '/../src/globals/config.ts', 'utf8');
config = config
    .replace(/name: .*/, `name: '${package_json_1.default.name}',`)
    .replace(/version: .*/, `version: '${package_json_1.default.version}',`)
    .replace(/description: .*/, `description: '${package_json_1.default.description}',`);
fs_1.default.writeFileSync(__dirname + '/../src/globals/config.ts', config);
