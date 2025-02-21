import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
	Dimensions,
	Modal,
	ScrollView,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import ZoomViewer from 'react-native-image-zoom-viewer';
import {Image, Text} from 'react-native-normalized';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {fetchRoom} from '../../../core/actions/room';
import {
	BaseTouchable,
	Content,
	Label,
	VSpace,
} from '../../../core/components/Base';
import {BlockText} from '../../../core/components/BlockText';
import {BlockTextTitle} from '../../../core/components/BlockTextTitle';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {UnifiedProgress} from '../../../core/components/UnifiedProgress';
import {RN5Routes} from '../../../core/data/rn5-routes';
import {globalStyles} from '../../../core/functions/styles';
import {mapToUniversity} from '../../../core/functions/uni-slug';
import {useAppState} from '../../../core/functions/use-app-state';
import {
	AppearanceMap,
	useAppearance,
} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {AppLanguage} from '../../../core/models/app-language';
import rawStrings from '../../../core/raw-strings';
import {getRoomState} from '../../../core/reducers/room';
import {RoomType} from '../../../core/types/schedule';
import {ExternalLinks} from '../api/ExternalLinks';
import {ErrorCode} from './ErrorCode';
import {Map} from './Map';

const renderAddress = (room: RoomType, language: AppLanguage) => {
	if (!room.address) {
		return null;
	}

	return (
		<View style={{paddingHorizontal: 12}}>
			<VSpace />
			<VSpace />
			<BlockTextTitle>{rawStrings.ADDRESS[language]}</BlockTextTitle>
			<BlockText text={room.address} />
		</View>
	);
};

const renderPlan = (
	room: RoomType,
	language: AppLanguage,
	onEnlarge: () => void,
	appearance: AppearanceMap,
	leftInset: number,
	rightInset: number
) => {
	if (!room.plan) {
		return null;
	}

	if (!room.plan_dimensions) {
		return (
			<BaseTouchable padded onPress={() => ExternalLinks.openPlan(room)}>
				<Content>
					<Label>{rawStrings.OPEN_PLAN[language]}</Label>
				</Content>
			</BaseTouchable>
		);
	}

	const {width, height} = room.plan_dimensions;
	const {width: windowWidth} = Dimensions.get('window');
	const actualWidth = windowWidth - leftInset - rightInset;

	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginRight: 12,
					paddingHorizontal: 12,
				}}
			>
				<BlockTextTitle>{rawStrings.PLAN[language]}</BlockTextTitle>
				<View style={globalStyles.flex1} />
				<TouchableOpacity onPress={() => onEnlarge()}>
					<Text style={{fontSize: 13, color: appearance.BLUE_TINT}}>
						{rawStrings.ENLARGE[language]}
					</Text>
				</TouchableOpacity>
			</View>
			<VSpace />
			<TouchableWithoutFeedback onPress={() => onEnlarge()}>
				<Image
					source={{uri: room.plan}}
					style={{width: actualWidth, height: height * (actualWidth / width)}}
				/>
			</TouchableWithoutFeedback>
		</View>
	);
};

const renderMap = (room: RoomType) => {
	if (!room.location) {
		return null;
	}

	const {longitude, latitude} = room.location;

	if (longitude === null || latitude === null) {
		return null;
	}

	return <Map longitude={longitude} latitude={latitude} title={room.name} />;
};

const renderGoogleMaps = (room: RoomType, language: AppLanguage) => {
	const {location} = room;
	if (!location) {
		return null;
	}

	return (
		<BaseTouchable
			padded
			onPress={() =>
				ExternalLinks.openMaps(location.latitude, location.longitude)
			}
		>
			<Content>
				<Label>{rawStrings.OPEN_ROUTE_IN_GOOGLE[language]}</Label>
			</Content>
		</BaseTouchable>
	);
};

const RoomDetailView = () => {
	const route = useRoute<RouteProp<RN5Routes, 'RoomDetailView'>>();
	const {unislug, uni_identifier} = route.params;
	const university = mapToUniversity(unislug);
	const roomState = useAppState((state) =>
		getRoomState(state, `${university}/${uni_identifier}`)
	);
	const {error, data, loading} = roomState;
	const language = useLanguage();
	const navigation = useNavigation();
	const [showModal, setShowModal] = useState(false);
	const dispatch = useDispatch();
	const appearance = useAppearance();
	const {left: leftInset, right: rightInset} = useSafeAreaInsets();

	useEffect(() => {
		if (roomState.data) {
			navigation.setOptions({
				title: roomState.data.name,
			});
		}
	}, [navigation, roomState]);

	useEffect(() => {
		if (!roomState.data) {
			dispatch(fetchRoom(university, uni_identifier));
		}
	}, [dispatch, uni_identifier, roomState.data, university]);

	if (loading || !data) {
		return <UnifiedProgress />;
	}

	if (error) {
		return <ErrorCode error={error} />;
	}

	return (
		<ScrollView style={{backgroundColor: appearance.BACKGROUND}}>
			{renderMap(data)}
			<SafeSideSpace>
				{renderAddress(data, language)}
				<VSpace />
				<VSpace />
				<View style={{paddingHorizontal: 12}}>
					<BlockTextTitle>{rawStrings.ACTIONS[language]}</BlockTextTitle>
					<VSpace />
					{renderGoogleMaps(data, language)}
					<VSpace />
					<VSpace />
					<VSpace />
				</View>
				<VSpace />
				{renderPlan(
					data,
					language,
					() => {
						setShowModal(true);
					},
					appearance,
					leftInset,
					rightInset
				)}
				{data.plan ? (
					<Modal
						visible={showModal}
						onRequestClose={() => {
							setShowModal(false);
						}}
						animationType="fade"
					>
						<ZoomViewer
							imageUrls={[{url: data.plan}]}
							saveToLocalByLongPress={false}
							enableSwipeDown
							backgroundColor="rgba(0, 0, 0, 0.9)"
							onClick={() => {
								setShowModal(false);
							}}
							renderHeader={() => (
								<TouchableOpacity
									style={{
										marginTop: 20,
										marginLeft: 14,
									}}
									onPress={() => {
										setShowModal(false);
									}}
								>
									<Image
										source={require('../assets/clear.png')}
										style={{
											width: 36,
											height: 36,
											tintColor: 'white',
										}}
									/>
								</TouchableOpacity>
							)}
							onCancel={() => {
								setShowModal(false);
							}}
						/>
					</Modal>
				) : null}
			</SafeSideSpace>
		</ScrollView>
	);
};

export default RoomDetailView;
