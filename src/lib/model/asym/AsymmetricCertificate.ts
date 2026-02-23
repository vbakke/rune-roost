import type { Message } from "../Message.svelte.ts";

export interface KeyPair {
    publicKey: Message;
    privateKey: Message;
}

export interface AsymmetricCertificate
{
    publicKey: Message;
    privateKey: Message;
    
    generateKeyPair(): void;

    // The follwoing `generateNext...()` is bollocks in the real world,
    // but for learning purposes, it might be useful for seeing a pattern.
    generateNextPrivateKey(): void;
    generateNextPublicKey(): void;
}

export interface AsymmetricEncryption
{
    encrypt(plaintext: Message, publicKey: Message): Message;
    decrypt(ciphertext: Message, privateKey: Message): Message;
}