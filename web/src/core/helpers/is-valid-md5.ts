import ismd5 from 'is-md5';

export const isValidMd5 = function (md5: string): boolean {
	return ismd5(md5);
};
