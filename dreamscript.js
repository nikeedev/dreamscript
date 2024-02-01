
// wrote this just to use in this project xD

class Enum {
    constructor(array_enums) {
        let enums = {};

        array_enums.forEach((enumr, i) => {
            enums[enumr] = enumr;
        });

        return enums;
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
        "ConstInit", // ::
        "Number", // 0-9
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
            switch (this.chars[i]) {
                case '\n':
                case ' ':
                case '\t':
                case '\r':
                    this.tokens.push(new Token(TokenTypes.Whitespace, this.chars[i]))
                    break;
                case ':':
                    if (this.chars[i+1] === ':') {
                        this.tokens.push(new Token(TokenTypes.ConstInit, this.chars[i]+this.chars[i+1]));
                        break;
                    }
                    this.tokens.push(new Token(TokenTypes.Colon, this.chars[i]));
                    break;

                case '+':
                    this.tokens.push(new Token(TokenTypes.Plus, this.chars[i]));
                    break;

                case Number.isInteger(parseInt(this.chars[i])):
                    let int = this.chars[i];
                    let n = 1;
                    while (Number.isInteger(parseInt(this.chars[i+n]))) {
                        int += parseInt(this.chars[i+n]);
                        n++;
                    }
                    // this.tokens.push(new Token(TokenTypes.Number, this.chars[i]));
                    this.tokens.push(new Token(TokenTypes.Number, int));
                    break;
                default: 
                    this.tokens.push(new Token(TokenTypes.Unknown, this.chars[i]));
                    break;

            }
        }
    }
}

export const compile = (text) => {
    const compiler = new Lexer(text);
    compiler.lex();
    console.log(compiler.tokens);
};