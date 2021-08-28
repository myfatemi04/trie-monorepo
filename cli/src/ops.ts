import * as protocol from './protocol';
import { sendRequest } from './protocol';

export async function insert(key: string): Promise<boolean> {
	const result = await sendRequest(protocol.insert(key));
	return result;
}

export async function remove(key: string): Promise<boolean> {
	const result = await sendRequest(protocol.delete_(key));
	return result;
}

export async function exists(key: string): Promise<boolean> {
	const result = await sendRequest(protocol.exists(key));
	return result;
}

export async function complete(key: string): Promise<string[]> {
	const result = await sendRequest(protocol.complete(key));
	return result;
}

export async function keys(): Promise<string[]> {
	const result = await sendRequest(protocol.keys());
	return result;
}

export async function reset(): Promise<boolean> {
	const result = await sendRequest(protocol.reset());
	return result;
}
