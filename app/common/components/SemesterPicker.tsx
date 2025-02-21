import React, {Fragment, useState} from 'react';
import {
	Platform,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components';
import {CheckItem, Label, VSpace} from '../../../core/components/Base';
import {ModalCancelButton} from '../../../core/components/ModalCancelButton';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {renderSemester} from '../../../core/functions/render-semester';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {BottomModalPadding} from './BottomModalPadding';

const ModalContent = styled(View)`
	padding-bottom: 0;
	padding: 12px;
	${Platform.OS === 'ios'
		? `	
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	`
		: ''}
`;

const StyledModal = styled(Modal)`
	justify-content: flex-end;
	margin: 0;
`;

type Props = {
	onChange: (s: string) => void;
	availableSemesters: string[];
	semester: string;
	style?: any;
	children: React.ReactNode;
};

export const SemesterPicker = (props: Props) => {
	const [visible, setVisible] = useState(false);
	const language = useLanguage();
	const hide = () => {
		setVisible(false);
	};

	const appearance = useAppearance();
	const renderModalContent = () => {
		return (
			<ModalContent style={{backgroundColor: appearance.BACKGROUND}}>
				<SafeSideSpace>
					{props.availableSemesters.map((s) => (
						<Fragment key={s}>
							<CheckItem
								active={props.semester === s}
								onPress={
									s
										? () => {
												hide();
												props.onChange(s);
										  }
										: () => {
												// noop
										  }
								}
							>
								<Label active={props.semester === s}>
									{renderSemester(s, language)}
								</Label>
							</CheckItem>
							<VSpace />
						</Fragment>
					))}
					<ModalCancelButton
						onPress={() => {
							hide();
						}}
					/>
					<BottomModalPadding />
				</SafeSideSpace>
			</ModalContent>
		);
	};

	return (
		<View style={props.style}>
			<TouchableOpacity
				onPress={() => {
					setVisible((prev) => !prev);
				}}
			>
				{props.children}
			</TouchableOpacity>
			{visible ? (
				<TouchableWithoutFeedback onPress={() => hide()}>
					<StyledModal
						useNativeDriver
						isVisible={visible}
						onBackdropPress={() => hide()}
						onBackButtonPress={() => hide()}
					>
						{renderModalContent()}
					</StyledModal>
				</TouchableWithoutFeedback>
			) : null}
		</View>
	);
};
