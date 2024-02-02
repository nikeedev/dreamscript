
// wrote this just to use in this project xD

class Enum {
    constructor(...array_enums) {
        let enums = {};

        array_enums.forEach((enumr, i) => {
            this[enumr] = enumr;
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
    "IsSameAs", // =
    "Colon", // :
    "Init", // :=
    "ConstInit", // ::
    "Number", // 0-9
    "OpenParen",   // (
    "ClosedParen", // )
    "Identifier", // anything else
    "Unknown" //  ¯\_(ツ)_/¯
);

// console.log(TokenTypes);

class Token {
    token_type
    value
    constructor(token_type, value) {
        this.token_type = token_type;
        this.value = value;
    }
}

class Lexer {
    text = ""
    chars = [];
    tokens = [];
    /** @constructor */
    constructor(text) {
        this.text = text;
        this.chars = text.split('');
    }

    lex() {
        for (let i = 0; i < this.chars.length; i++) {
            // console.log(/\d/.test(this.chars[i]));

            if (/\d/.test(this.chars[i])) {
                let int = this.chars[i];
                let n = 1;
                while (/\d/.test(this.chars[i + n])) {
                    int += this.chars[i + n];
                    n++;
                }
                this.tokens.push(new Token(TokenTypes.Number, parseInt(int)));
            } else {
                switch (this.chars[i]) {
                    case '\n':
                    case ' ':
                    case '\t':
                    case '\r':
                        this.tokens.push(new Token(TokenTypes.Whitespace, this.chars[i]));
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

                    case '(':
                        this.tokens.push(new Token(TokenTypes.OpenParen, this.chars[i]));
                        break;

                    case ')':
                        this.tokens.push(new Token(TokenTypes.ClosedParen, this.chars[i]));
                        break;

                    case '+':
                        this.tokens.push(new Token(TokenTypes.Plus, this.chars[i]));
                        break;

                    case '*':
                        this.tokens.push(new Token(TokenTypes.Multiplication, this.chars[i]));
                        break;

                    case '/':
                        if (this.chars[i + 1] === '/') {
                            break;
                            let n = 1;
                            let sn = "";
                            while (this.chars[i + n] != '\n') {
                                n++;
                                sn += this.chars[i + n];
                            }
                            this.tokens.push(new Token(TokenTypes.Comment, sn));
                            i += n;
                        }
                        this.tokens.push(new Token(TokenTypes.Division, this.chars[i]));
                        break;

                    default:
                        this.tokens.push(new Token(TokenTypes.Unknown, this.chars[i]));
                        break;
                }
            }
        }
    }
}

export const compile = (text) => {
    const compiler = new Lexer(text);
    compiler.lex();

    let general = "font-style: italic; font-weight: bold; font-size: 20px; border-radius: 5px; background-color: #000000; color: #ffffff; padding: 10px; background: -webkit-linear-gradient(#fff, cornflowerblue);-webkit-background-clip: text; -webkit-text-fill-color: transparent;";

    console.log("%cdreamscript ⭐ %cv0.1.0%c by nikeedev", `${general}`, `${general} font-style: normal; padding: 10px; font-size: 20px;`, `${general} color: cornflowerblue;`);
    console.group("%cdreamscript ⭐ logs", `${general} padding: 3px; font-size: 12px;`);

    console.table(compiler.tokens);
    console.groupEnd();
};