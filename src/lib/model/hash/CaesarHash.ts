import { CaesarRot } from "../../methods/CaesarRot.ts";
import { Message } from "../Message.ts";

export class CaesarHash
{
    public static hash2(text1: string, text2: string): Message {
        return CaesarRot.rotateStringForward(text1, text2);
    }

    public static hash(msg: Message): Message {
        if (!msg || msg.plain.length === 0) {
            return new Message('');
        }

        let hash: string = msg.plain[0];
        for (let c: string of msg.plain.slice(1)) {
            hash = CaesarRot.rotateStringForward(hash, c).plain;
        }
        return new Message(hash);    
    }
}