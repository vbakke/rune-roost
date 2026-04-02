import { CaesarRot } from "$lib/methods/CaesarRot.ts";
import { CryptoRandom } from "$lib/methods/CryptoRnd.ts";
import { Message } from "../Message.svelte.ts";
import type { SecretKey } from "./SecretKey.svelte.ts";
import type { SymmetricEncryption } from "./SymmetricEncryption.ts";

export class SymCaesar implements SymmetricEncryption
{
    encrypt(message: Message, secret: SecretKey): Message
    {
        return CaesarRot.rotateStringForward(message.plain, secret.key.plain, secret.alphabet);
    }
    
    decrypt(ciphertext: Message, secret: SecretKey): Message {
        return CaesarRot.rotateStringReverse(ciphertext.plain, secret.key.plain, secret.alphabet);
    }

}