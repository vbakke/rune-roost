import { Message } from "../model/Message.svelte.ts";

export class CryptoRandom
{
    public static randomChar(str: string): string {
        const index = this.random(str.length);
        return str[index];
    }

    public static random(max: number): number {
        if (max <= 256) {
            return this.randomUint8(max);
        } else if (max <= 65536) {
            return this.randomUint16(max);
        }
        return NaN  
    }

    public static randomUint8(max: number): number {
        const array = new Uint8Array(1);
        crypto.getRandomValues(array);

        let value: number = array[0] % max;
        
        if (value >= Math.trunc(256 / max) * max) {
            return this.randomUint8(max);
        }
        return value;
    }

    public static randomUint16(max: number): number {
        const array = new Uint16Array(1);
        crypto.getRandomValues(array);

        let value: number = array[0] % max;
        
        if (value >= Math.trunc(65536 / max) * max) {
            return this.randomUint16(max);
        }
        return value;
    }
}