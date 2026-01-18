import { Message } from "../model/Message.ts";

export class CaesarRot
{
    public static rotateStringForward(input: string, secretKey: string): Message {
        return this.rotateString(input, secretKey, +1);
    }

    public static rotateStringReverse(input: string, secretKey: string): Message {
        return this.rotateString(input, secretKey, -1);
    }

    public static rotateString(input: string, secretKey: string, direction: number): Message {
        const alphabet = Message.ROMAN_ALPHABET;
        let rotated: string = "";
        let keyIndex: number = 0;
        for (let char of input) {
            let index: number = alphabet.indexOf(char);
            if (index === -1) {
                rotated += char; 
            } else {
                index += alphabet.indexOf(secretKey[keyIndex]) * direction;
                index = (index + alphabet.length) % alphabet.length;

                rotated += alphabet[index];
            }
            keyIndex = (keyIndex + 1) % secretKey.length;
        }
        return new Message(rotated);
    }

}