import React from 'react';
import {Keyboard, TouchableOpacity} from 'react-native';
import {mapToUniSlug} from '../../../core/functions/uni-slug';
import {RoomType} from '../../../core/types/schedule';
import {globalNavigate} from '../api/set-master-navigator';
import RoomResult from './RoomResult';

export const TouchableRoomResult: React.FC<{
	result: RoomType;
}> = ({result}) => {
	const onPress = React.useCallback(() => {
		Keyboard.dismiss();
		globalNavigate('RoomDetailView', {
			uni_identifier: result.id,
			unislug: mapToUniSlug(result.university),
		});
	}, [result]);

	return (
		<TouchableOpacity onPress={onPress}>
			<RoomResult room={result} />
		</TouchableOpacity>
	);
};
