import { CaesarRot } from "../../methods/CaesarRot.ts";
import type { Message } from "../Message.ts";

export class CaesarHash
{
    public static hash(text1: string, text2: string): Message {
        return CaesarRot.rotateStringForward(text1, text2);
    }
}