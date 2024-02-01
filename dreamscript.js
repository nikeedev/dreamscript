
// wrote this just to use in this project xD

class Enum {
    constructor(array_enums) {
        let enums = {};

        array_enums.forEach((enumr, i) => {
            this[enumr] = enumr;
        });

        // return enums;
    }
}


const TokenTypes = new Enum(
    [
        "Whitespace", // 
        "Plus", // + 
        "Minus", // -
        "Star", // *
        "Slash", // /
        "IsSameAs", // =
        "Colon", // :
        "Init", // :=
        "ConstInit", // ::
        "Number", // 0-9
        "OpenParen",   // (
        "ClosedParen", // )
        "Identifier", // anything else
        "Unknown" //  ¯\_(ツ)_/¯
    ]
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
                            break;
                        } else if (this.chars[i + 1] === '=') {
                            this.tokens.push(new Token(TokenTypes.Init, this.chars[i] + this.chars[i + 1]));
                            break;
                        }
                        this.tokens.push(new Token(TokenTypes.Colon, this.chars[i]));
                        break;
                    
                    case '(':
                        this.tokens.push(new Token(TokenTypes.OpenParan, this.chars[i]));
                        break;
                        
                    case ')':
                        this.tokens.push(new Token(TokenTypes.ClosedParan, this.chars[i]));
                        break;

                    case '+':
                        this.tokens.push(new Token(TokenTypes.Plus, this.chars[i]));
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
    return compiler.tokens;
};