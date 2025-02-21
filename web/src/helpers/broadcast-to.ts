import {Server} from 'socket.io';

export const broadcastTo = (
	io: Server,
	channel: string,
	message: string,
	payload: any
) => {
	io.to('all').emit(message, payload);
	io.to(channel).emit(message, payload);
};
