import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const nano = customAlphabet(alphabet, 12);

export function newId(prefix: string): string {
  return `${prefix}_${nano()}`;
}

export function certUid(): string {
  const alnum = customAlphabet("0123456789ABCDEFGHJKLMNPQRSTUVWXYZ", 10);
  return `AUR-${alnum()}`;
}
