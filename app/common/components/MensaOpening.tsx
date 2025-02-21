import format from 'date-fns/format';
import setDay from 'date-fns/setDay';
import React from 'react';
import {Platform, View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {Config} from '../../../core/data/Config';
import {SingleCanteen} from '../../../core/data/uzh-mensa';
import {Colors} from '../../../core/functions/Colors';
import {formatString} from '../../../core/functions/format-string';
import OpeningHours from '../../../core/functions/opening-hours';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import MensaInfo from './MensaInfo';

const Container = styled(View)``;

const FixedWidth = styled(View)`
	width: 120px;
`;

const Label = styled(Text)``;

export const MensaOpening = ({
	mensa,
	isToday,
	closed,
}: {
	mensa: SingleCanteen;
	isToday: boolean;
	closed: boolean;
}) => {
	const language = useLanguage();
	const appearance = useAppearance();
	if (!mensa.openingHours) {
		return null;
	}

	if (closed) {
		return (
			<MensaInfo
				style={{marginBottom: 3, marginTop: 2}}
				color={Colors.Red}
				source={require('../assets/twotone_timelapse_black_48dp.png')}
			>
				<Container>
					<Label style={{color: Colors.Red}}>
						{rawStrings.CLOSED[language]}
					</Label>
				</Container>
			</MensaInfo>
		);
	}

	if (isToday) {
		const l = new OpeningHours(mensa.openingHours, language).label();
		if (!l) {
			return null;
		}

		const [label, color] = l;
		return (
			<MensaInfo
				style={{marginBottom: 3, marginTop: 2}}
				color={color}
				source={require('../assets/twotone_timelapse_black_48dp.png')}
			>
				<Container>
					<Label style={{color}}>{label}</Label>
				</Container>
			</MensaInfo>
		);
	}

	const timetable = new OpeningHours(
		mensa.openingHours,
		language,
		setDay(new Date(), 5)
	).timetable();
	return (
		<MensaInfo
			style={{marginBottom: 3, marginTop: 2}}
			source={require('../assets/twotone_timelapse_black_48dp.png')}
		>
			<Container>
				{timetable.map((t) => (
					<Container key={t[0]} style={{flexDirection: 'row'}}>
						<FixedWidth>
							<Label
								style={{
									color: appearance.SUBTITLE,
									fontFamily:
										Platform.OS === 'ios' || Config.IS_WEB_APP
											? 'Roboto Mono'
											: 'robotomono',
									fontSize: 13,
								}}
							>
								{format(t[0], 'HH:mm')} - {format(t[1], 'HH:mm')}
							</Label>
						</FixedWidth>
						<Label style={{color: appearance.SUBTITLE}}>
							{t[3]
								? formatString(rawStrings.ONLY_X[language], t[3])
								: rawStrings.FOOD_DISTRIBUTION[language]}
						</Label>
					</Container>
				))}
			</Container>
		</MensaInfo>
	);
};
