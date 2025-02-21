import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native-normalized';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import {cannotNavigate} from '../../../core/functions/cannot-navigate';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getModuleId} from '../../../core/functions/get-module-id';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {Credit} from '../../../core/models/credit';
import {emptySingleExamReturnState} from '../../../core/reducers/exam-returns';
import {globalNavigate} from '../api/set-master-navigator';
import {AddGradeCTA} from './AddGradeCTA';
import {CreditCellUnreadBubble} from './CreditCellUnreadBubble';
import {CreditViewItem} from './CreditViewItem';

type Props = {
	credit: Credit;
};

const Container = styled(View)<{
	leftInset: number;
	rightInset: number;
}>`
	flex-direction: row;
	padding-left: ${(props) => props.leftInset}px;
	padding-right: ${(props) => props.rightInset}px;
`;

export const CreditCellWithOption = (props: Props) => {
	const safeArea = useSafeAreaInsets();

	const navigateable = !cannotNavigate(props.credit);
	const hiddenContent = useAppState((state) => state.hiddenContent);
	const showGradeOut = useAppState((state): boolean => {
		if (props.credit.status !== 'ADDED' && props.credit.status !== 'FAILED') {
			return false;
		}

		if (!navigateable) {
			return false;
		}

		const institution = CreditHelpers.getInstitution(props.credit);
		const moduleId = getModuleId(props.credit);
		if (
			hiddenContent.includes(`reminder-add-grade-${institution}-${moduleId}`)
		) {
			return false;
		}

		const period = CreditHelpers.getPeriod(props.credit);
		const s =
			state.examReturns[institution]?.[String(moduleId)] ??
			emptySingleExamReturnState;
		if (!s.data) {
			return false;
		}

		if (s.data.find((d) => d.period === period)) {
			return true;
		}

		return false;
	});
	const content = (
		<View>
			<Container leftInset={safeArea.left} rightInset={safeArea.right}>
				<View style={globalStyles.flex1}>
					<CreditViewItem {...props} />
				</View>
				<View>
					<TouchableOpacity
						style={{marginRight: 12, padding: 4, marginTop: 10}}
						onPress={() => {
							globalNavigate('CreditConfiguration', {
								credit: props.credit,
								showAddedIndicator: false,
							});
						}}
					>
						<Image
							source={require('../assets/baseline_more_vert_black_18dp.png')}
							style={{height: 20, width: 20, tintColor: 'gray'}}
						/>
					</TouchableOpacity>
					<View style={{marginLeft: 4, marginTop: 10}}>
						<CreditCellUnreadBubble credit={props.credit} />
					</View>
				</View>
			</Container>
			{showGradeOut ? <AddGradeCTA credit={props.credit} /> : null}
		</View>
	);
	return navigateable ? (
		content
	) : (
		<TouchableOpacity
			onPress={() => {
				globalNavigate('CreditConfiguration', {
					credit: props.credit,
					showAddedIndicator: false,
				});
			}}
		>
			{content}
		</TouchableOpacity>
	);
};
