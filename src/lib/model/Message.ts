export enum PlainType { AUTO, DECIMAL, HEX, ROMAN, ASCII, UNICODE, BASE64}


export class Message {
    static ROMAN_ALPHABET: string = 'ABCDEFGHIKLMNOPQRSTVXYZ';
    // static ROMAN_ALPHABET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    plain: string;
    type: PlainType;

    constructor(plaintext: string, type: PlainType = PlainType.AUTO) {
        this.plain = plaintext;
        this.type = type ? type : PlainType.AUTO;

        if (this.type == PlainType.AUTO) {
            let types: PlainType[] = this.identifyPossibleTypes(plaintext);
            this.type = types[0];
        }
        // this.type = type;
    }

    toString(): string {
        return this.plain;
    }

    get encoded(): string {
        // For now, return plain text. Can be extended for Base64, Hex, etc.
        return this.plain;
    }

    identifyPossibleTypes(text: string) {
        let types: PlainType[] = [];
        
        if (this.isDecimal(text)) types.push(PlainType.DECIMAL);
        if (this.isHex(text)) types.push(PlainType.HEX);
        // if (this.isBase64(text)) types.push(PlainType.BASE64);
        if (this.isRoman(text)) types.push(PlainType.ROMAN);
        // if (this.isAscii(text)) types.push(PlainType.ASCII);
        // if (this.isUnicode(text)) types.push(PlainType.UNICODE);

        return types;
    }

    isDecimal(text: string): boolean {
        return !!text.match(/^[0-9]+$/);
    }
    isHex(text: string) {
        return !!text.match(/^[0-9a-fA-F]+$/);
    }
    isRoman(text: string) {
        return !!text.match(`^[${Message.ROMAN_ALPHABET}]+$`);
    }


}