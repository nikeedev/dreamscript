import {compile} from './dreamscript.js';

// const str = `
// main :: () {
    
// }
// `;

const str = `1 + 1`;

let general = "font-style: italic; font-weight: bold; font-size: 20px; border-radius: 5px; background-color: #000000; color: #ffffff; padding: 10px;";

console.log("%cdreamscript ⭐ %cv0.1.0%c by nikeedev", `${general}`, `${general} font-style: normal; padding: 10px; font-size: 20px;`, `${general} color: cornflowerblue;`);
console.group("%cdreamscript ⭐ logs", `${general} padding: 3px; font-size: 12px;`);

console.log(compile(str));
console.groupEnd();
