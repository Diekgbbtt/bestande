import {ImageSize} from '../../../../core/types/types';

declare module 'request-image-size' {
	export default function hi(fn: string): Promise<ImageSize>;
}
