import { CaesarRot } from "$lib/methods/CaesarRot.ts";
import { CryptoRandom } from "$lib/methods/CryptoRnd.ts";
import { Message, PlainType } from "../Message.svelte.ts";

export class SecretKey {
    public key: Message = $state(new Message(''));

    constructor(public alphabet: string, key?: Message) {
        if (alphabet === 'ROMAN') {
            this.alphabet = Message.ROMAN_ALPHABET;
        }else if (alphabet === 'LATIN') {
            this.alphabet = Message.LATIN_ALPHABET;
        }


        if (key) {
            this.key = key;
        } else {
            this.generateKey();
        }
        console.log(`Generated secret key: ${this.key.plain} for alphabet ${this.alphabet}`);
    }

    toString(): string {
        return this.key.plain;
    }

    generateKey(): void {
        this.key = new Message(CryptoRandom.randomChar(this.alphabet.substring(1)));
    }

    generateNextSecretKey(direction: number = 1): void {
        if (direction > 0) {
            this.key = CaesarRot.rotateStringForward(this.key.plain, 'B', this.alphabet);
        } else {
            this.key = CaesarRot.rotateStringReverse(this.key.plain, 'B', this.alphabet);
        }
    }

    remapToAlphabet(newAlphabetType: string): void {
        // Find the current key's position (index) in the current alphabet
        const currentIndex = this.alphabet.indexOf(this.key.plain);
        
        // Normalize and update to the new alphabet
        let normalizedAlphabet = newAlphabetType;
        if (newAlphabetType === 'ROMAN') {
            normalizedAlphabet = Message.ROMAN_ALPHABET;
        } else if (newAlphabetType === 'LATIN') {
            normalizedAlphabet = Message.LATIN_ALPHABET;
        }
        this.alphabet = normalizedAlphabet;
        
        // Map to the character at the same position in the new alphabet
        if (!this.alphabet.includes(this.key.plain)) {
            this.generateNextSecretKey(); 
        }
        console.log(`Remapped secret key to ${newAlphabetType} alphabet: ${this.key.plain} at position ${currentIndex}`);
    }
}