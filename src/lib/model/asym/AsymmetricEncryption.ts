import type { Message } from "../Message.ts";

export interface KeyPair {
    publicKey: Message;
    privateKey: Message;
}

export interface AsymmetricEncryption
{
    generateKeyPair(): KeyPair;
    
    encrypt(plaintext: Message, publicKey: Message): Message;
    decrypt(ciphertext: Message, privateKey: Message): Message;
}