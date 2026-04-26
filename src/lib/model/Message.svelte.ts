export enum PlainType { AUTO, ROMAN, LATIN, ASCII, UNICODE, DECIMAL, HEX, BASE64}

/** All input encoding types shown on the advanced symmetric page. */
export type InputEncoding = 'ROMAN' | 'LATIN' | 'ASCII' | 'UTF8' | 'HEX' | 'BASE64';

export class Message {
    static ROMAN_ALPHABET: string = 'ABCDEFGHIKLMNOPQRSTVXYZ';
    static LATIN_ALPHABET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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
        if (this.isBase64(text)) types.push(PlainType.BASE64);
        if (this.isRoman(text)) types.push(PlainType.ROMAN);
        if (this.isLatin(text)) types.push(PlainType.LATIN);
        if (this.isAscii(text)) types.push(PlainType.ASCII);
        if (this.isUnicode(text)) types.push(PlainType.UNICODE);

        return types;
    }

    isDecimal(text: string): boolean {
        return !!text?.match(/^[0-9]+$/);
    }
    isHex(text: string) {
        return !!text?.match(/^[0-9a-fA-F]+$/);
    }
    isBase64(text: string): boolean {
        if (!text || text.length === 0) return false;
        // Standard base64: A-Z a-z 0-9 + / with optional = padding
        return !!text.match(/^[A-Za-z0-9+/]+=*$/) && text.length % 4 === 0;
    }
    isRoman(text: string) {
        return !!text?.match(`^[${Message.ROMAN_ALPHABET}]+$`);
    }
    isLatin(text: string): boolean {
        // Basic Latin A-Z a-z plus common Latin supplement (accented chars, etc.)
        return !!text?.match(/^[A-Za-z\u00C0-\u024F\s.,!?'"()-]+$/);
    }
    isAscii(text: string): boolean {
        // Printable ASCII 0x20–0x7E
        return !!text && [...text].every(c => c.charCodeAt(0) >= 0x20 && c.charCodeAt(0) <= 0x7e);
    }
    isUnicode(text: string): boolean {
        // Any string is valid Unicode; only mark true when it goes beyond ASCII
        return !!text && [...text].some(c => c.charCodeAt(0) > 0x7e);
    }

    /**
     * Returns which InputEncoding pills are valid for the given text.
     * Used by the advanced symmetric page to auto-disable pills.
     */
    static validEncodings(text: string): InputEncoding[] {
        if (!text) return [];
        const m = new Message(text);
        const valid: InputEncoding[] = [];
        if (m.isRoman(text)) valid.push('ROMAN');
        if (m.isLatin(text)) valid.push('LATIN');
        if (m.isAscii(text)) valid.push('ASCII');
        if (m.isUnicode(text) || m.isAscii(text)) valid.push('UTF8');
        if (m.isHex(text)) valid.push('HEX');
        if (m.isBase64(text)) valid.push('BASE64');
        return valid;
    }
}