import type { AsyncSymmetricEncryption, AesEncryptResult, AesMode } from './AsyncSymmetricEncryption.ts';

const ZERO_IV_16 = new Uint8Array(16); // reusable zero IV for ECB blocks

/** Return a fresh Uint8Array<ArrayBuffer> of `n` random bytes. */
function randomBytes(n: number): Uint8Array<ArrayBuffer> {
    return crypto.getRandomValues(new Uint8Array(n)).slice() as Uint8Array<ArrayBuffer>;
}

/** Ensure the buffer is a plain ArrayBuffer (not SharedArrayBuffer). */
function safeSlice(u: Uint8Array): Uint8Array<ArrayBuffer> {
    return u.slice() as Uint8Array<ArrayBuffer>;
}

export class SymAes implements AsyncSymmetricEncryption {

    // ─── Encrypt ───────────────────────────────────────────────────────────────

    async encrypt(
        plaintext: Uint8Array,
        key: CryptoKey,
        mode: AesMode,
        iv?: Uint8Array
    ): Promise<AesEncryptResult> {
        switch (mode) {
            case 'ECB': return this._encryptEcb(plaintext, key);
            case 'CBC': return this._encryptCbc(plaintext, key, iv);
            case 'CTR': return this._encryptCtr(plaintext, key, iv);
            case 'GCM': return this._encryptGcm(plaintext, key, iv);
        }
    }

    // ─── Decrypt ───────────────────────────────────────────────────────────────

    async decrypt(
        cipher: Uint8Array,
        key: CryptoKey,
        mode: AesMode,
        iv: Uint8Array | null
    ): Promise<Uint8Array> {
        switch (mode) {
            case 'ECB': return this._decryptEcb(cipher, key);
            case 'CBC': return this._decryptCbc(cipher, key, iv!);
            case 'CTR': return this._decryptCtr(cipher, key, iv!);
            case 'GCM': return this._decryptGcm(cipher, key, iv!);
        }
    }

    // ─── Re-import key for a specific algorithm name ──────────────────────────

    /**
     * Web Crypto keys are bound to an algorithm at import time.
     * We need to re-export and re-import when switching between AES-GCM / AES-CBC / AES-CTR.
     */
    private async _rekey(key: CryptoKey, algoName: string): Promise<CryptoKey> {
        const raw = await crypto.subtle.exportKey('raw', key);
        return crypto.subtle.importKey(
            'raw', raw,
            { name: algoName },
            false,
            ['encrypt', 'decrypt']
        );
    }

    // ─── ECB (educational wrapper over per-block CBC with zero IV) ─────────────
    //
    // ⚠️  AES-ECB is cryptographically insecure. It is implemented here solely
    //     for educational purposes to demonstrate the block-repetition flaw.
    //     Never use ECB in production.

    private async _encryptEcb(plaintext: Uint8Array, key: CryptoKey): Promise<AesEncryptResult> {
        const padded = this._pkcs7Pad(plaintext, 16);
        const ecbKey = await this._rekey(key, 'AES-CBC');
        const blocks: Uint8Array[] = [];

        for (let offset = 0; offset < padded.length; offset += 16) {
            const block = safeSlice(padded.slice(offset, offset + 16));
            // AES-CBC with zero IV is identical to AES-ECB for a single block
            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-CBC', iv: ZERO_IV_16.slice() as Uint8Array<ArrayBuffer> },
                ecbKey,
                block
            );
            // AES-CBC on a single block pads to 32 bytes; take only the first 16
            blocks.push(new Uint8Array(encrypted).slice(0, 16));
        }

        return { cipher: this._concat(blocks), iv: null };
    }

    private async _decryptEcb(cipher: Uint8Array, key: CryptoKey): Promise<Uint8Array> {
        const ecbKey = await this._rekey(key, 'AES-CBC');
        const blocks: Uint8Array[] = [];

        for (let offset = 0; offset < cipher.length; offset += 16) {
            const block = cipher.slice(offset, offset + 16);
            // Append an extra dummy block so AES-CBC can decrypt without complaining about padding
            const withPadBlock = new Uint8Array(32);
            withPadBlock.set(block, 0);
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-CBC', iv: ZERO_IV_16.slice() as Uint8Array<ArrayBuffer> },
                ecbKey,
                withPadBlock.slice() as Uint8Array<ArrayBuffer>
            );
            blocks.push(new Uint8Array(decrypted).slice(0, 16));
        }

        return this._pkcs7Unpad(this._concat(blocks));
    }

    // ─── CBC ───────────────────────────────────────────────────────────────────

    private async _encryptCbc(
        plaintext: Uint8Array,
        key: CryptoKey,
        iv?: Uint8Array
    ): Promise<AesEncryptResult> {
        const usedIv = iv ? safeSlice(iv) : randomBytes(16);
        const cbcKey = await this._rekey(key, 'AES-CBC');
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-CBC', iv: usedIv },
            cbcKey,
            safeSlice(plaintext)
        );
        return { cipher: new Uint8Array(encrypted), iv: usedIv };
    }

    private async _decryptCbc(
        cipher: Uint8Array,
        key: CryptoKey,
        iv: Uint8Array
    ): Promise<Uint8Array> {
        const cbcKey = await this._rekey(key, 'AES-CBC');
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv: safeSlice(iv) },
            cbcKey,
            safeSlice(cipher)
        );
        return new Uint8Array(decrypted);
    }

    // ─── CTR ───────────────────────────────────────────────────────────────────

    private async _encryptCtr(
        plaintext: Uint8Array,
        key: CryptoKey,
        counter?: Uint8Array
    ): Promise<AesEncryptResult> {
        const usedCounter = counter ? safeSlice(counter) : randomBytes(16);
        const ctrKey = await this._rekey(key, 'AES-CTR');
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-CTR', counter: usedCounter, length: 64 },
            ctrKey,
            safeSlice(plaintext)
        );
        return { cipher: new Uint8Array(encrypted), iv: usedCounter };
    }

    private async _decryptCtr(
        cipher: Uint8Array,
        key: CryptoKey,
        counter: Uint8Array
    ): Promise<Uint8Array> {
        const ctrKey = await this._rekey(key, 'AES-CTR');
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-CTR', counter: safeSlice(counter), length: 64 },
            ctrKey,
            safeSlice(cipher)
        );
        return new Uint8Array(decrypted);
    }

    // ─── GCM ───────────────────────────────────────────────────────────────────

    private async _encryptGcm(
        plaintext: Uint8Array,
        key: CryptoKey,
        iv?: Uint8Array
    ): Promise<AesEncryptResult> {
        // GCM standard recommends 96-bit (12-byte) nonces
        const usedIv = iv ? safeSlice(iv) : randomBytes(12);
        const gcmKey = await this._rekey(key, 'AES-GCM');
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: usedIv },
            gcmKey,
            safeSlice(plaintext)
        );
        return { cipher: new Uint8Array(encrypted), iv: usedIv };
    }

    private async _decryptGcm(
        cipher: Uint8Array,
        key: CryptoKey,
        iv: Uint8Array
    ): Promise<Uint8Array> {
        const gcmKey = await this._rekey(key, 'AES-GCM');
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: safeSlice(iv) },
            gcmKey,
            safeSlice(cipher)
        );
        return new Uint8Array(decrypted);
    }

    // ─── PKCS#7 padding helpers ────────────────────────────────────────────────

    private _pkcs7Pad(data: Uint8Array, blockSize: number): Uint8Array {
        const padLen = blockSize - (data.length % blockSize);
        const padded = new Uint8Array(data.length + padLen);
        padded.set(data);
        padded.fill(padLen, data.length);
        return padded;
    }

    private _pkcs7Unpad(data: Uint8Array): Uint8Array {
        if (data.length === 0) return data;
        const padLen = data[data.length - 1];
        return data.slice(0, data.length - padLen);
    }

    // ─── Utility ───────────────────────────────────────────────────────────────

    private _concat(arrays: Uint8Array[]): Uint8Array {
        const total = arrays.reduce((s, a) => s + a.length, 0);
        const out = new Uint8Array(total);
        let offset = 0;
        for (const a of arrays) { out.set(a, offset); offset += a.length; }
        return out;
    }
}
