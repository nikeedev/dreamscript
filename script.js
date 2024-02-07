import {compile} from './dreamscript.js';

const str = `
main :: () {
    println("Hello world!");
}
`;

// const str = `
// //1 + 1
// (1 * 5) + 2
// "hello world"
// `;

compile(str);
