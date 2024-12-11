const fs = require('node:fs');
const { exit } = require('node:process');

/** wrote this just to use in this project xD */
class Enum {
    constructor(...array_enums) {
        let enums = {};

        array_enums.forEach((enum_N, i) => {
            this[enum_N] = enum_N;
        });

        // return enums;
    }
}

const TokenTypes = new Enum(
    "Whitespace", // 
    "Plus", // + 
    "Minus", // -
    "Multiplication", // *
    "Division", // /
    "Percent", // %
    "Comment", //
    "Equals", // =
    "BoolEquals", // ==
    "Colon", // :
    "String", // ""
    "Init", // :=
    "ConstInit", // ::
    "Number", // 0-9
    "OpenParen",   // (
    "ClosedParen", // )
    "OpenBrace",   // {
    "ClosedBrace", // }
    "OpenBracket", // [
    "ClosedBracket", // ]
    "Function", // fn
    "Identifier", // anything else,
    "If", // if 
    "Else", // else
    "Dot", // .
    "Comma", // ,
    "Pixels", // px
    "Print", // print
    "Rem", // rem
    "Comment", // //
    "Unknown", //  ¯\_(ツ)_/¯,

    // Commands
    "Box",
    "Circle",
    "Text"
);

// console.log(TokenTypes);

class Token {
    /** @type {Enum} */
    token_type;
    /** @type {String} */
    value = "";
    constructor(token_type, value) {
        this.token_type = token_type;
        this.value = value;
    }
}

class Lexer {
    /** @type {String} */
    text = "";
    /** @type {Array<String>} */
    chars = [];
    /** @type {Array<Token>} */
    tokens = [];
    /** @type {boolean} */
    include_whitespace;

    /**
     * @constructor 
     * @param {String} text
     * @param {boolean} include_whitespace
    */
    constructor(text, include_whitespace = true) {
        this.text = text;
        this.chars = text.split('');
        this.include_whitespace = include_whitespace;
    }

    lex() {
        // console.log(this.chars);
        for (let i = 0; i < this.chars.length; i++) {
            // console.log(this.chars[i]);


            switch (this.chars[i]) {
                case '\n':
                case ' ':
                case '\t':
                case '\r':
                    if (this.include_whitespace) this.tokens.push(new Token(TokenTypes.Whitespace, this.chars[i]));
                    break;

                case '.':
                    this.tokens.push(new Token(TokenTypes.Dot, this.chars[i]));
                    break;

                case ',':
                    this.tokens.push(new Token(TokenTypes.Comma, this.chars[i]));
                    break;

                case ':':
                    if (this.chars[i + 1] === ':') {
                        this.tokens.push(new Token(TokenTypes.ConstInit, this.chars[i] + this.chars[i + 1]));
                        i++;
                        break;
                    } else if (this.chars[i + 1] === '=') {
                        this.tokens.push(new Token(TokenTypes.Init, this.chars[i] + this.chars[i + 1]));
                        i++;
                        break;
                    }
                    this.tokens.push(new Token(TokenTypes.Colon, this.chars[i]));
                    break;

                case '=':
                    if (this.chars[i + 1] === '=') {
                        this.tokens.push(new Token(TokenTypes.BoolEquals, this.chars[i] + this.chars[i + 1]));
                        i++;
                        break;
                    }
                    this.tokens.push(new Token(TokenTypes.Equals, this.chars[i]));
                    break;

                case '+':
                    this.tokens.push(new Token(TokenTypes.Plus, this.chars[i]));
                    break;

                case '*':
                    this.tokens.push(new Token(TokenTypes.Multiplication, this.chars[i]));
                    break;

                case '/':
                    if (this.chars[i + 1] === '/') {
                        let n = 2;
                        let sn = "";
                        while (this.chars[i + n] != '\n' && this.chars[i + n] != undefined) {
                            // console.log("comment: ", String.raw`${this.chars[i + n]}`);
                            sn += this.chars[i + n];
                            n++;
                        }
                        this.tokens.push(new Token(TokenTypes.Comment, sn));
                        i += n;
                        break;
                    }
                    this.tokens.push(new Token(TokenTypes.Division, this.chars[i]));
                    break;

                case "%":
                    this.tokens.push(new Token(TokenTypes.Percent, this.chars[i]));
                    break;

                case '"':
                    let n = 1;
                    let str = "";
                    while (this.chars[i + n] != `"`) {
                        str += this.chars[i + n];
                        n++;
                    }
                    i += n;
                    this.tokens.push(new Token(TokenTypes.String, str));
                    break;

                case '(':
                    this.tokens.push(new Token(TokenTypes.OpenParen, this.chars[i]));
                    break;

                case ')':
                    this.tokens.push(new Token(TokenTypes.ClosedParen, this.chars[i]));
                    break;

                case '{':
                    this.tokens.push(new Token(TokenTypes.OpenBrace, this.chars[i]));
                    break;

                case '}':
                    this.tokens.push(new Token(TokenTypes.ClosedBrace, this.chars[i]));
                    break;

                case '[':
                    this.tokens.push(new Token(TokenTypes.OpenBracket, this.chars[i]));
                    break;

                case ']':
                    this.tokens.push(new Token(TokenTypes.ClosedBracket, this.chars[i]));
                    break;

                default:
                    if (/[0-9.]/.test(this.chars[i])) {
                        let int = this.chars[i];
                        let n = 1;
                        while (/[0-9.]/.test(this.chars[i + n])) {
                            int += this.chars[i + n];
                            n++;
                        }
                        i += n - 1;
                        this.tokens.push(new Token(TokenTypes.Number, parseFloat(int)));
                        // console.log("here its me!:", this.chars[i]);
                        break;
                    }
                    else if (/[a-zA-Z0-9_]+$/i.test(this.chars[i])) {

                        // console.log(i)
                        // console.log("ident")
                        let identifier = this.chars[i];
                        // console.log("it is: ", identifier);
                        let n = 1;

                        while (/^[a-zA-Z0-9_]+$/i.test(this.chars[i + n]) && (this.chars[i + n] !== '(' && this.chars[i + n] !== ')')) {
                            identifier += this.chars[i + n];
                            // console.log("int manager: ", this.chars[i + n]);
                            n++;
                        }
                        i += n - 1;

                        // console.log("it is: ", identifier.toString());

                        switch (identifier) {
                            case "print":
                                this.tokens.push(new Token(TokenTypes.Print, identifier));
                                break;

                            case "if":
                                this.tokens.push(new Token(TokenTypes.If, identifier));
                                break;

                            case "else":
                                this.tokens.push(new Token(TokenTypes.Else, identifier));
                                break;

                            case "px":
                                this.tokens.push(new Token(TokenTypes.Pixels, identifier));
                                break;

                            case "rem":
                                this.tokens.push(new Token(TokenTypes.Rem, identifier));
                                break;

                            case "Box":
                                if (this.chars[i + 1] === '(') {
                                    let sn = identifier;

                                    while (this.chars[i] !== ')') {
                                        i++;
                                        sn += this.chars[i];
                                    }

                                    this.tokens.push(new Token(TokenTypes.Box, sn));
                                }
                                break;

                            case "Circle":
                                if (this.chars[i + 1] === '(') {
                                    let sn = identifier;

                                    while (this.chars[i] !== ')') {
                                        i++;
                                        sn += this.chars[i];
                                    }

                                    this.tokens.push(new Token(TokenTypes.Circle, sn));
                                }
                                break;

                            case "Text":
                                if (this.chars[i + 1] === '(') {
                                    let sn = identifier;

                                    while (this.chars[i] !== ')') {
                                        i++;
                                        sn += this.chars[i];
                                    }

                                    this.tokens.push(new Token(TokenTypes.Text, sn));
                                }
                                break;

                            default:
                                this.tokens.push(new Token(TokenTypes.Identifier, identifier));
                                break;
                        }
                        break;
                    }
                    this.tokens.push(new Token(TokenTypes.Unknown, this.chars[i]));
                    break;
            }
        }
    }
}

/** @param tokens {Array<Token>} */
const run_tokens = (tokens) => {
    let css_src = "";
    let html_src = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${process.argv[2]}</title>
    <style>
        body {
            position: relative;
        }
    </style>
    <link rel="stylesheet" href="${process.argv[2]}.style.css">
</head>
<body>
`;
    tokens.forEach((token, i) => {
        switch (token.token_type) {
            case TokenTypes.Whitespace:
                css_src += `${token.value}`;
                break;

            case TokenTypes.Function:
                css_src += "function";
                break;

            case TokenTypes.Identifier:
                css_src += `${token.value}`;
                break;

            // case TokenTypes.OpenParen:
            //     css_src += `${token.value}`;
            //     break;

            // case TokenTypes.ClosedParen:
            //     css_src += `${token.value}`;
            //     break;

            // case TokenTypes.OpenBrace:
            //     css_src += `${token.value}`;
            //     break;

            // case TokenTypes.ClosedBrace:
            //     css_src += `${token.value} `;
            //     break;

            // case TokenTypes.String:
            //     css_src += `"${token.value}"`;
            //     break;

            // case TokenTypes.Comma:
            //     css_src += `${token.value}`;
            //     break;

            case TokenTypes.Number:
                css_src += `${token.value}`;
                if (tokens[i + 1].token_type !== TokenTypes.Pixels && tokens[i + 1].token_type !== TokenTypes.Percent && tokens[i + 1].token_type !== TokenTypes.Rem) {
                    css_src += "px";
                }
                break;

            case TokenTypes.Comment:
                css_src += `/** ${token.value} **/`;
                break;

            case TokenTypes.Pixels:
                css_src += `${token.value}`;
                break;

            case TokenTypes.Rem:
                css_src += `${token.value}`;
                break;

            case TokenTypes.Print:
                html_src += `<p>${tokens[i + 2].value}</p>`;
                break;

            case TokenTypes.Box:
                /* Box(id, width, height, x, y, color) */
                let box_params = token.value.substring(3, token.value.length);
                box_params = new Lexer(box_params, false);
                box_params.lex();

                box_params = box_params.tokens
                    .map((token) => token.value)
                    .filter((value) => value !== ',' && value !== '(' && value !== ')')
                    .map((value, i, tokens) => {
                        if (typeof value === 'number') {
                            switch (tokens[i + 1]) {
                                case "rem":
                                    return `${value}rem`;
                                case "px":
                                    return `${value}px`;
                                default:
                                    return `${value}px`;
                            }
                        }
                        return value;
                    })
                    .filter((value) => value !== 'rem' && value !== 'px');

                html_src += `<div id="${box_params[0]}"></div>`;
                css_src += `\n#${box_params[0]} {\n    position: absolute;\n    width: ${box_params[1]};\n    height: ${box_params[2]};\n    left: ${box_params[3]};\n    top: ${box_params[4]};\n    background-color:${box_params[5]};\n}`
                break;
            
            case TokenTypes.Circle:
                /* Circle(id, width, height, x, y, color) */
                let circle_params = token.value.substring(7, token.value.length);
                circle_params = new Lexer(circle_params, false);
                circle_params.lex();

                circle_params = circle_params.tokens
                    .map((token) => token.value)
                    .filter((value) => value !== ',' && value !== '(' && value !== ')')
                    .map((value, i, tokens) => {
                        if (typeof value === 'number') {
                            switch (tokens[i + 1]) {
                                case "rem":
                                    return `${value}rem`;
                                case "px":
                                    return `${value}px`;
                                default:
                                    return `${value}px`;
                            }
                        }
                        return value;
                    })
                    .filter((value) => value !== 'rem' && value !== 'px');
                
                html_src += `<div id="${circle_params[0]}"></div>`;
                css_src += `\n#${circle_params[0]} {\n    position: absolute;\n    width: ${circle_params[1]};\n    height: ${circle_params[2]};\n    left: ${circle_params[3]};\n    top: ${circle_params[4]};\n    background-color:${circle_params[5]};\n    border-radius:200px;\n}`
                break;
            
            case TokenTypes.Text:
                /* Box(id, width, height, x, y, color) */
                let text_params = token.value.substring(4, token.value.length);
                text_params = new Lexer(text_params, false);
                text_params.lex();

                text_params = text_params.tokens
                    .map((token) => token.value)
                    .filter((value) => value !== ',' && value !== '(' && value !== ')')
                    .map((value, i, tokens) => {
                        if (typeof value === 'number') {
                            switch (tokens[i + 1]) {
                                case "rem":
                                    return `${value}rem`;
                                case "px":
                                    return `${value}px`;
                                default:
                                    return `${value}px`;
                            }
                        }
                        return value;
                    })
                    .filter((value) => value !== 'rem' && value !== 'px');

                html_src += `<p id="${text_params[0]}">${text_params[3]}</p>`;
                css_src += `\n#${text_params[0]} {\n    position: absolute;\n    left: ${text_params[1]};\n    top: ${text_params[2]};\n}`
                break;


            default:
                // css_src += `${token.value}`;
                break;
        }
    })

    html_src += `
</body>
</html>
    `;
    try {
        fs.writeFileSync(`${process.argv[2]}.index.html`, html_src);
        fs.writeFileSync(`${process.argv[2]}.style.css`, css_src);
        // file written successfully
    } catch (err) {
        console.error(err);
    }
}


const compile = (text) => {
    const compiler = new Lexer(text);
    
    try {
        compiler.lex();
    } catch (err) {
        console.error("dreamscript ⭐ error compiling the source file: ", err);
        exit(0);
    }

    // console.table(compiler.tokens);

    run_tokens(compiler.tokens);
};

if ((typeof process !== 'undefined') && (process.release.name === 'node')) {
    if (process.argv.length > 2) {
        fs.readFile(process.argv[2], 'utf8', (err, data) => {
            if (err) {
                console.error("dreamscript ⭐ error reading/getting the source file: ", err.message);
                console.log("\ndreamscript ⭐ v0.1.0 by nikeedev");
                console.group("dreamscript ⭐: Usage: [file].dream");
                return;
            } else {
                console.log("dreamscript ⭐ v0.1.0 by nikeedev");

                compile(data);
                console.groupEnd();
            }
        });
    } else {

        console.log("dreamscript ⭐ v0.1.0 by nikeedev");
        console.group("dreamscript ⭐: Usage: [file].dream");
        console.groupEnd();
    }
}