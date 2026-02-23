import type { Message } from "../Message.svelte.ts";
import type { SecretKey } from "./SecretKey.svelte.ts";

export interface SymmetricEncryption
{
    encrypt(plaintext: Message, secret: SecretKey): Message;
    decrypt(ciphertext: Message, secret: SecretKey): Message;
}