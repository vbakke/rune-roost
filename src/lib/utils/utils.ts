export function prefNow(): string {
    const now = performance.now() / 1000;
    return now.toFixed(3) + 's: ';
}