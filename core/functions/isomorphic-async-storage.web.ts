// Also has a native equivalent in .ts
// make sure to align the APIs

// ts-unused-exports:disable-next-line
export const setAsyncIsomorphic = (
	key: string,
	value: string
): Promise<void> => {
	return Promise.resolve(localStorage.setItem(key, value));
};

// ts-unused-exports:disable-next-line
export const getAsyncIsomorphic = (key: string): Promise<string | null> => {
	return Promise.resolve(localStorage.getItem(key));
};
