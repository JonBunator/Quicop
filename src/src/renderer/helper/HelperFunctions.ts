// Hashes a string using the SHA256 algorithm
import { Md5 } from 'ts-md5';

export default function hash(str: string) {
	return Md5.hashStr(str);
}
