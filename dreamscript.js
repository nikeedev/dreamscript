const fs = require('node:fs');
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
    "Unknown" //  ¯\_(ツ)_/¯,
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
            // console.log(this.chars[i]);


            switch (this.chars[i]) {
                case '\n':
                case ' ':
                case '\t':
                case '\r':
                    this.tokens.push(new Token(TokenTypes.Whitespace, this.chars[i]));
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
                        let n = 1;
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
    <link rel="stylesheet" href="style.css">
</head>
<body>
`;
    tokens.forEach(token => {
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

            case TokenTypes.OpenParen:
                css_src += `${token.value}`;
                break;

            case TokenTypes.ClosedParen:
                css_src += `${token.value}`;
                break;

            case TokenTypes.OpenBrace:
                css_src += `${token.value}`;
                break;

            case TokenTypes.ClosedBrace:
                css_src += `${token.value} `;
                break;

            case TokenTypes.String:
                css_src += `"${token.value}"`;
                break;

            case TokenTypes.Comma:
                css_src += `${token.value}`;
                break;

            case TokenTypes.Number:
                css_src += `${token.value}`;
                break;

            default:
                break;
        }
    })

    html_src += `
</body>
</html>
    `;
    try {
        fs.writeFileSync('index.html', html_src);
        fs.writeFileSync('style.css', css_src);
        // file written successfully
    } catch (err) {
        console.error(err);
    }
}


const compile = (text) => {
    const compiler = new Lexer(text);
    compiler.lex();

    console.log("dreamscript ⭐ v0.1.0 by nikeedev");

    // console.table(compiler.tokens);

    run_tokens(compiler.tokens);
};

if ((typeof process !== 'undefined') && (process.release.name === 'node')) {
    if (process.argv[2] !== undefined) {
        fs.readFile(process.argv[2], 'utf8', (err, data) => {
            if (err) {
                console.error("dreamscript ⭐ error reading/getting the source file: ", err);
                return;
            } else {
                console.log("dreamscript ⭐ v0.1.0 by nikeedev");
                console.group("dreamscript ⭐: Usage: [file].dream");

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