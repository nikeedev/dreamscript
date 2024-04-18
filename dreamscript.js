// wrote this just to use in this project xD
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
    "PrintLn",
    "Identifier", // anything else,
    "If", // if 
    "Else", // else
    "For", // for
    "While", // while
    "Unknown" //  ¯\_(ツ)_/¯
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

    /**
     * @constructor 
     * @param {String} text
    */
    constructor(text) {
        this.text = text;
        this.chars = text.split('');
    }

    lex() {
        // console.log(this.chars);
        for (let i = 0; i < this.chars.length; i++) {
            console.log(this.chars[i]);
            
            
            switch (this.chars[i]) {
                case '\n':
                case ' ':
                case '\t':
                case '\r':
                    // this.tokens.push(new Token(TokenTypes.Whitespace, this.chars[i]));
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
                        n = 1;
                        let sn = "";
                        while (this.chars[i + n] != '\n') {
                            n++;
                            sn += this.chars[i + n];
                        }
                        // this.tokens.push(new Token(TokenTypes.Comment, sn));
                        i += n;
                        break;
                    }
                    this.tokens.push(new Token(TokenTypes.Division, this.chars[i]));
                    break;

                case '"':
                    let n = 1;
                    let str = "";
                    while (this.chars[i + n] != `"`) {
                        str += this.chars[i + n];
                        n++;
                    }
                    i += n + 1;
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
                    if (/\d/.test(this.chars[i])) {
                        let int = this.chars[i];
                        let n = 1;
                        while (/\d/.test(this.chars[i + n])) {
                            int += this.chars[i + n];
                            n++;
                        }
                        i += n;
                        this.tokens.push(new Token(TokenTypes.Number, parseInt(int)));
                        break;
                    }
                    else if (/^[a-zA-Z0-9_]+$/i.test(this.chars[i])) {
                        // console.log("ident")
                        let identifier = this.chars[i];
                        let n = 1;

                        while (/^[a-zA-Z0-9_]+$/i.test(this.chars[i + n])  && (this.chars[i + n] !== '(' && this.chars[i + n] !== ')')) {
                            identifier += this.chars[i + n];
                            n++;
                        }
                        i += n;

                        switch (identifier) {
                            case "fn":
                                this.tokens.push(new Token(TokenTypes.Function, identifier));
                                break;

                            case "println":
                                this.tokens.push(new Token(TokenTypes.PrintLn, identifier));
                                break;

                            case "if":
                                this.tokens.push(new Token(TokenTypes.If, identifier));
                                break;

                            case "else":
                                this.tokens.push(new Token(TokenTypes.Else, identifier));
                                break;

                            case "for":
                                this.tokens.push(new Token(TokenTypes.For, identifier));
                                break;

                            case "while":
                                this.tokens.push(new Token(TokenTypes.While, identifier));
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

class Parser {
    /** @type {Array<Token>} */
    tokens = [];

    current = 0;

    /**
     * @constructor
     * @param {Array<Token>} tokens 
     */
    constructor(tokens) {
        this.tokens = tokens;
    }

    // expression() {
    //     return equality();
    // }
}

const run_tokens = (tokens) => {
    console.log(tokens)
}

/*
export const compile = (text) => {
    const compiler = new Lexer(text);
    compiler.lex();

    let general = "font-style: italic; font-weight: bold; font-size: 20px; border-radius: 5px; background-color: #000000; color: #ffffff; padding: 10px; background: -webkit-linear-gradient(180deg, #ffffff, cornflowerblue);-webkit-background-clip: text; -webkit-text-fill-color: transparent;";

    console.log("%cdreamscript ⭐ %cv0.1.0%c by nikeedev", `${general}`, `${general} font-style: normal; padding: 10px; font-size: 20px;`, `${general} color: cornflowerblue;`);
    console.group("%cdreamscript ⭐ logs", `${general} padding: 3px; font-size: 12px;`);

    console.table(compiler.tokens);
    console.groupEnd();
};
*/

const compile = (text) => {
    const compiler = new Lexer(text);
    compiler.lex();

    let general = "font-style: italic; font-weight: bold; font-size: 20px; border-radius: 5px; background-color: #000000; color: #ffffff; padding: 10px; background: -webkit-linear-gradient(180deg, #ffffff, cornflowerblue);-webkit-background-clip: text; -webkit-text-fill-color: transparent;";

    console.log("%cdreamscript ⭐ %cv0.1.0%c by nikeedev", `${general}`, `${general} font-style: normal; padding: 10px; font-size: 20px;`, `${general} color: cornflowerblue;`);

    console.table(compiler.tokens);

    run_tokens(compiler.tokens);
};

if ((typeof process !== 'undefined') && (process.release.name === 'node')) {
    if (process.argv[2] !== undefined) {
        const fs = require('node:fs');
        fs.readFile(process.argv[2], 'utf8', (err, data) => {
            if (err) {
                console.error("dreamscript ⭐ error reading/getting the source file: ", err);
                return;
            } else {
                let general = "font-style: italic; font-weight: bold; font-size: 20px; border-radius: 5px; background-color: #000000; color: #ffffff; padding: 10px; background: -webkit-linear-gradient(180deg, #ffffff, cornflowerblue);-webkit-background-clip: text; -webkit-text-fill-color: transparent;";

                console.log("%cdreamscript ⭐ %cv0.1.0%c by nikeedev", `${general}`, `${general} font-style: normal; padding: 10px; font-size: 20px;`, `${general} color: cornflowerblue;`);
                console.group("%cdreamscript ⭐: Usage: [file].dream", `${general} padding: 3px; font-size: 12px;`);

                compile(data);
                console.groupEnd();
            }
        });
    } else {
        let general = "font-style: italic; font-weight: bold; font-size: 20px; border-radius: 5px; background-color: #000000; color: #ffffff; padding: 10px; background: -webkit-linear-gradient(180deg, #ffffff, cornflowerblue);-webkit-background-clip: text; -webkit-text-fill-color: transparent;";

        console.log("%cdreamscript ⭐ %cv0.1.0%c by nikeedev", `${general}`, `${general} font-style: normal; padding: 10px; font-size: 20px;`, `${general} color: cornflowerblue;`);
        console.group("%cUsage: <dreamscript source file>", `${general} padding: 3px; font-size: 12px;`);
        console.groupEnd();
    }
}