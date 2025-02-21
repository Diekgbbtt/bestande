import gcm from 'node-gcm';

const serverKey =
	'AAAAwc-hVx4:APA91bFCrYDT9A0tAh2rGWF1vVMz3fKj2-OOJJCPDXkV84HW9ToeHosMmbGevQFxycaUZ1FQkwfk2edFTQPqgd57w7YikYZ_Txs4FM1vHuD2Tuu8-z7dGp7XiqWoYYJQlOHEnXthq_3-';

const sender = new gcm.Sender(serverKey);

export const sendAndroidPushNotification = ({
	deviceToken,
	uni_identifier,
	university,
	title,
	subtitle,
	short_name,
}: {
	deviceToken: string;
	uni_identifier: string;
	university: string;
	title: string;
	subtitle: string;
	short_name: string;
}) => {
	const message = new gcm.Message({
		notification: {
			title,
			body: subtitle,
			icon: (undefined as unknown) as string,
		},
		data: {
			uni_identifier,
			university,
			short_name,
		},
	});
	return new Promise((resolve, reject) => {
		sender.send(
			message,
			{registrationTokens: [deviceToken]},
			(err, response) => {
				if (err) {
					reject(err);
				} else {
					resolve(response);
				}
			}
		);
	});
};
