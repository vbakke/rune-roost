import { CaesarRot } from "$lib/methods/CaesarRot";
import { CryptoRandom } from "$lib/methods/CryptoRnd";
import { Message } from "../Message.svelte.ts";
import type { AsymmetricCertificate } from "./AsymmetricCertificate.ts";

export class AsymCaesarRotCertificate implements AsymmetricCertificate {
    publicKey: Message = $state(new Message(''));
    privateKey: Message = $state(new Message(''));

    constructor(private alphabet: string) {
        this.alphabet = alphabet;
        this.generateKeyPair();
    }

    generateKeyPair(): void {
        this.privateKey = new Message(CryptoRandom.randomChar(this.alphabet));
        this.publicKey = this.calculateOtherKey(this.privateKey);

        if (this.publicKey.plain === 'A' || this.privateKey.plain === 'A' || this.publicKey.plain === this.privateKey.plain) {
            return this.generateKeyPair();
        }
    }

    generateNextPrivateKey(): void {
        this.privateKey = CaesarRot.rotateStringForward(this.privateKey.plain, 'B');
        this.publicKey = this.calculateOtherKey(this.privateKey);
    }

    generateNextPublicKey(): void {
        this.publicKey = CaesarRot.rotateStringForward(this.publicKey.plain, 'B');
        this.privateKey = this.calculateOtherKey(this.publicKey);
    }

    private calculateOtherKey(key: Message): Message {
        const index = this.alphabet.indexOf(key.plain);
        const otherIndex = (this.alphabet.length - index) % this.alphabet.length;
        return new Message(this.alphabet[otherIndex]);
    }
}