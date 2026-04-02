import { CaesarRot } from "../../methods/CaesarRot.ts";
import { Message } from "../Message.svelte.ts";

export class CaesarHash
{
    public static hash(msg: Message, alphabet: string = Message.ROMAN_ALPHABET): Message {
        if (!msg || msg.plain.length === 0) {
            return new Message('');
        }
        let len = 3;
        let hash: string = msg.plain.substring(0, len);
        console.log(`Initial hash: ${hash}`);
        let i = len;
        while (i < msg.plain.length) {
            let c = msg.plain.substring(i, i + len);
            i += len;
            hash = CaesarRot.rotateStringForward(hash, c, alphabet).plain;
            console.log(`After processing '${c}': ${hash}`);
        }
        return new Message(hash);    
    }
}