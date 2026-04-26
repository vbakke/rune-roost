import { CaesarRot } from "$lib/methods/CaesarRot.ts";
import { CryptoRandom } from "$lib/methods/CryptoRnd.ts";
import { Message, PlainType } from "../Message.svelte.ts";
import bcrypt from 'bcryptjs';

export type KeySource = 'caesar' | 'binary' | 'password';
export type KeyDisplayEncoding = 'hex' | 'base64';
export type NormForm = 'NFC' | 'NFD' | 'NFKC' | 'NFKD';
export type KdfType = 'PBKDF2' | 'bcrypt' | 'argon2';

export class SecretKey {
    public key: Message = $state(new Message(''));

    // ---- AES key fields ----
    public keySource: KeySource = $state('caesar');
    public keyBytes: Uint8Array | null = $state(null);
    public cryptoKey: CryptoKey | null = $state(null);
    public keyDisplayEncoding: KeyDisplayEncoding = $state('hex');
    /** Length in bits for the derived/generated AES key (128, 192, or 256). */
    public aesKeyBits: 128 | 192 | 256 = $state(256);

    constructor(public alphabet: string, key?: Message) {
        if (alphabet === 'ROMAN') {
            this.alphabet = Message.ROMAN_ALPHABET;
        }else if (alphabet === 'LATIN') {
            this.alphabet = Message.LATIN_ALPHABET;
        }


        if (key != null) {
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

    // ---- AES key methods ----

    /** Generate a random AES key of `bits` length and store it. */
    async generateAesKey(bits: 128 | 192 | 256 = 256): Promise<void> {
        this.aesKeyBits = bits;
        const ck = await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: bits },
            true,
            ['encrypt', 'decrypt']
        );
        const exported = await crypto.subtle.exportKey('raw', ck);
        this.keyBytes = new Uint8Array(exported);
        this.cryptoKey = ck;
        this.keySource = 'binary';
    }

    /** Import raw key bytes from a hex string. */
    async fromHex(hex: string): Promise<void> {
        const clean = hex.replace(/\s/g, '');
        if (clean.length === 0 || clean.length % 2 !== 0) return;
        const bytes = new Uint8Array(clean.length / 2);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
        }
        await this._importBytes(bytes);
        this.keySource = 'binary';
    }

    /** Import raw key bytes from a base64 string. */
    async fromBase64(b64: string): Promise<void> {
        const binary = atob(b64.trim());
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        await this._importBytes(bytes);
        this.keySource = 'binary';
    }

    /**
     * Derive an AES key from a password using the selected KDF.
     * The password is normalised to `normForm` before encoding to UTF-8.
     */
    async fromPassword(
        password: string,
        normForm: NormForm,
        kdf: KdfType,
        salt: Uint8Array
    ): Promise<void> {
        const normalised = password.normalize(normForm);
        const passwordBytes = new TextEncoder().encode(normalised);
        let keyBytes: Uint8Array;

        if (kdf === 'PBKDF2') {
            keyBytes = await this._pbkdf2(passwordBytes, salt);
        } else if (kdf === 'bcrypt') {
            keyBytes = await this._bcrypt(normalised, salt);
        } else {
            keyBytes = await this._argon2(passwordBytes, salt);
        }

        await this._importBytes(keyBytes);
        this.keySource = 'password';
    }

    /** Return keyBytes encoded as the selected display encoding (hex or base64). */
    get keyBytesDisplay(): string {
        if (!this.keyBytes) return '';
        if (this.keyDisplayEncoding === 'hex') {
            return Array.from(this.keyBytes).map(b => b.toString(16).padStart(2, '0')).join('');
        }
        return btoa(String.fromCharCode(...this.keyBytes));
    }

    // ---- Private helpers ----

    /** Copy bytes into a fresh ArrayBuffer so Web Crypto accepts them (avoids SharedArrayBuffer mismatch). */
    private _buf(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
        return bytes.slice();
    }

    private async _importBytes(bytes: Uint8Array): Promise<void> {
        const safe = this._buf(bytes);
        const bits = (safe.length * 8) as 128 | 192 | 256;
        this.aesKeyBits = bits;
        this.keyBytes = safe;
        this.cryptoKey = await crypto.subtle.importKey(
            'raw',
            safe,
            { name: 'AES-GCM' },
            true,
            ['encrypt', 'decrypt']
        );
    }

    private async _pbkdf2(passwordBytes: Uint8Array, salt: Uint8Array): Promise<Uint8Array> {
        const baseKey = await crypto.subtle.importKey(
            'raw', this._buf(passwordBytes), 'PBKDF2', false, ['deriveBits']
        );
        const bits = await crypto.subtle.deriveBits(
            { name: 'PBKDF2', salt: this._buf(salt), iterations: 310_000, hash: 'SHA-256' },
            baseKey,
            this.aesKeyBits
        );
        return new Uint8Array(bits);
    }

    private async _bcrypt(password: string, salt: Uint8Array): Promise<Uint8Array> {
        // bcrypt output is a 60-char string; we hash it with SHA-256 to get raw key bytes.
        // The salt is encoded as base64 to build a bcrypt-compatible salt string.
        const saltB64 = btoa(String.fromCharCode(...salt.slice(0, 16)));
        const bcryptSalt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, bcryptSalt);
        // Stretch the bcrypt output hash to key length via SHA-256/384/512
        const hashBytes = new TextEncoder().encode(hash);
        const hashAlgo = this.aesKeyBits === 128 ? 'SHA-256' : this.aesKeyBits === 192 ? 'SHA-384' : 'SHA-512';
        const derived = await crypto.subtle.digest(hashAlgo, hashBytes);
        return new Uint8Array(derived).slice(0, this.aesKeyBits / 8);
    }

    private async _argon2(passwordBytes: Uint8Array, salt: Uint8Array): Promise<Uint8Array> {
        // Lazy-load argon2-browser WASM only when actually needed
        const { hash } = await import('argon2-browser');
        const result = await hash({
            pass: passwordBytes,
            salt: salt.slice(0, 16),
            type: 2, // Argon2id
            mem: 65536,
            time: 3,
            parallelism: 1,
            hashLen: this.aesKeyBits / 8
        });
        return result.hash;
    }
}