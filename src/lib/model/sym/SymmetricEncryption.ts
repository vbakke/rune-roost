import type { Message } from "../Message.ts";

export interface SymmetricEncryption
{
    generateKey(): Message;
    encrypt(plaintext: Message, key: Message): Message;
    decrypt(ciphertext: Message, key: Message): Message;
}