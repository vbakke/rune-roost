export type AesMode = 'ECB' | 'CBC' | 'CTR' | 'GCM';

export interface AesEncryptResult {
    cipher: Uint8Array;
    /** IV/nonce used during encryption. Null for ECB (stateless per-block). */
    iv: Uint8Array | null;
}

export interface AsyncSymmetricEncryption {
    encrypt(
        plaintext: Uint8Array,
        key: CryptoKey,
        mode: AesMode,
        iv?: Uint8Array
    ): Promise<AesEncryptResult>;

    decrypt(
        cipher: Uint8Array,
        key: CryptoKey,
        mode: AesMode,
        iv: Uint8Array | null
    ): Promise<Uint8Array>;
}
