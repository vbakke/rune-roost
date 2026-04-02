import { CaesarRot } from "$lib/methods/CaesarRot.ts";
import { Message } from "../Message.svelte.ts";
import { AsymCaesarRotCertificate } from "./AesCaesarRotCertificate.svelte.ts";
import type { AsymmetricCertificate, AsymmetricEncryption, KeyPair } from "./AsymmetricCertificate.ts";

export class AsymCaesarRot implements AsymmetricEncryption
{
    constructor(private alphabet: string = Message.ROMAN_ALPHABET) {}

    encrypt(plaintext: Message, publicKey: Message): Message {
        return CaesarRot.rotateStringForward(plaintext.plain, publicKey.plain, this.alphabet);
    }

    decrypt(ciphertext: Message, privateKey: Message): Message {
        return CaesarRot.rotateStringForward(ciphertext.plain, privateKey.plain, this.alphabet);
    }
}