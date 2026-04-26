import { CaesarRot } from "$lib/methods/CaesarRot.ts";
import { CryptoRandom } from "$lib/methods/CryptoRnd.ts";
import { Message } from "../Message.svelte.ts";
import type { SecretKey } from "./SecretKey.svelte.ts";
import type { SymmetricEncryption } from "./SymmetricEncryption.ts";

export class SymCaesar implements SymmetricEncryption
{
    constructor(private alphabet: string = Message.ROMAN_ALPHABET) {}

    encrypt(message: Message, secret: SecretKey): Message
    {
        console.log(`Encrypting "${message.plain}" with secret key "${secret.key.plain}" using alphabet "${this.alphabet}"`);
        return CaesarRot.rotateStringForward(message.plain, secret?.key?.plain, this.alphabet);
    }
    
    decrypt(ciphertext: Message, secret: SecretKey): Message {
        console.log(`Decrypting "${ciphertext.plain}" with secret key "${secret.key.plain}" using alphabet "${this.alphabet}"`);
        return CaesarRot.rotateStringReverse(ciphertext.plain, secret?.key?.plain, this.alphabet);
    }

}