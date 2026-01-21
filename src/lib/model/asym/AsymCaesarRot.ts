import { CaesarRot } from "$lib/methods/CaesarRot.ts";
import { CryptoRandom } from "$lib/methods/CryptoRnd.ts";
import { Message } from "../Message.ts";
import type { AsymmetricEncryption, KeyPair } from "./AsymmetricEncryption.ts";

export class AsymCaesarRot implements AsymmetricEncryption
{
    generateKeyPair(): KeyPair {
        const len: number = Message.ROMAN_ALPHABET.length - 1;
        const privateIndex = CryptoRandom.random(len) + 1; 
        const publicIndex = (len - privateIndex) % Message.ROMAN_ALPHABET.length; 

        if (publicIndex === 0 || publicIndex === privateIndex || privateIndex === 0) 
            return this.generateKeyPair();
        else
            return {
                privateKey: new Message(Message.ROMAN_ALPHABET[privateIndex]),
                publicKey: new Message(Message.ROMAN_ALPHABET[publicIndex])
            };
    }

    encrypt(plaintext: Message, publicKey: Message): Message {
        return CaesarRot.rotateStringForward(plaintext.plain, publicKey.plain);
    }

    decrypt(ciphertext: Message, privateKey: Message): Message {
        return CaesarRot.rotateStringForward(ciphertext.plain, privateKey.plain);
    }
}