import { Message } from "../model/Message.svelte.ts";

export class CaesarRot
{
    public static rotateStringForward(input: string, secretKey: string, alphabet:string = Message.ROMAN_ALPHABET): Message {
        return this.rotateString(input, secretKey, +1, alphabet);
    }

    public static rotateStringReverse(input: string, secretKey: string, alphabet:string = Message.ROMAN_ALPHABET): Message {
        return this.rotateString(input, secretKey, -1, alphabet);
    }

    public static rotateString(input: string, secretKey: string, direction: number, alphabet:string = Message.ROMAN_ALPHABET): Message {
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