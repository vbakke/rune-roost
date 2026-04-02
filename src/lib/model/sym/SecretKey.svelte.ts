import { CaesarRot } from "$lib/methods/CaesarRot.ts";
import { CryptoRandom } from "$lib/methods/CryptoRnd.ts";
import { Message } from "../Message.svelte.ts";

export class SecretKey {
    public key: Message = $state(new Message(''));

    constructor(public alphabet: string) {
        this.generateKey();
    }

    generateKey(): void {
        this.key = new Message(CryptoRandom.randomChar(this.alphabet.substring(1)));
    }

    generateNextSecretKey(): void {
        this.key = CaesarRot.rotateStringForward(this.key.plain, 'B');
    }
}