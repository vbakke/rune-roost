import { CaesarRot } from "$lib/methods/CaesarRot.ts";
import { Message } from "../Message.ts";
import type { SymmetricEncryption } from "./SymmetricEncryption.ts";

export class SymCaesar implements SymmetricEncryption
{
    generateKey(): Message {
        const len: number = Message.ROMAN_ALPHABET.length - 1;
        const index = Math.floor(Math.random() * len) + 1; // Avoid 'A' as secret key
        return new Message(Message.ROMAN_ALPHABET[index]);
    }

    encrypt(message: Message, secretKey: Message): Message
    {
        return CaesarRot.rotateStringForward(message.plain, secretKey.plain);
    }
    
    decrypt(ciphertext: Message, secretKey: Message): Message {
        return CaesarRot.rotateStringReverse(ciphertext.plain, secretKey.plain);
    }

}