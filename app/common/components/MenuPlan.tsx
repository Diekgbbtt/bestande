import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-normalized';
import {connect} from 'react-redux';
import styled from 'styled-components/native';
import {MealComponent} from '../../../core/components/Meal';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {MensaId} from '../../../core/data/uzh-mensa';
import {getInstitutionOfMensa} from '../../../core/functions/get-institution-of-mensa';
import {getVisibleMenuPlans} from '../../../core/functions/get-visible-menu-plans';
import {openLink} from '../../../core/functions/open-link';
import {MensaInject, selectMensa} from '../../../core/functions/selectors';
import {uiKit} from '../../../core/functions/ui-kit';
import {useIsomorphicState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {Institution} from '../../../core/models/credit';
import {MensaApiResponse} from '../../../core/types/food';
import {BigCard} from './Card';
import {MensaInfo} from './MensaInfo';
import {MensaOpening} from './MensaOpening';

const Wrapper = styled(View)`
	margin-bottom: 12px;
`;

const Container = styled(BigCard)`
	padding: 0;
	margin-top: 6px;
	border-bottom-width: 1px;
	border-top-width: 1px;
	border-color: rgba(0, 0, 0, 0.1);
`;

const MensaHeader = styled(Text)`
	margin-bottom: 2px;
`;

const Separator = styled(View)`
	border-bottom-color: rgba(0, 0, 0, 0.1);
	border-bottom-width: 1px;
`;

const Header = styled(View)`
	padding-left: 12px;
	padding-right: 12px;
	margin-top: 12px;
`;

const WebsiteTouchable = styled(TouchableOpacity)`
	padding-left: 12px;
	padding-right: 12px;
	padding-top: 4px;
	padding-bottom: 4px;
`;

const WebsiteLink = styled(Text)`
	color: ${(props) => props.theme.BLUE_TINT};
`;

const Location = styled(Text)`
	padding-top: 2px;
	padding-bottom: 2px;
	color: gray;
`;

const MenuPlanUnconnected = (
	props: MensaInject & {
		menu: MensaApiResponse;
		mensaInstitution: Institution | null;
		isToday: boolean;
		mensaId: MensaId;
	}
) => {
	const planFiltered = useIsomorphicState((state) =>
		getVisibleMenuPlans(state.food, props.menu.plan)
	);
	const {link} = props.menu;
	const shouldShowInstitution =
		props.mensaInstitution === null ||
		props.institution !== props.mensaInstitution;
	const appearance = useAppearance();
	const institutionLabel = shouldShowInstitution ? (
		<Text style={{color: appearance.SUBTITLE, fontSize: 14, marginLeft: 8}}>
			{getInstitutionOfMensa(props.menu)}
		</Text>
	) : null;
	return (
		<Wrapper>
			<SafeSideSpace>
				<Header>
					<MensaHeader
						style={{
							...uiKit.bodyEmphasizedObject,
							fontSize: 18,
							color: appearance.TITLE,
						}}
					>
						{props.menu.name} {institutionLabel}
					</MensaHeader>
					<MensaOpening
						closed={props.menu.plan.length === 0}
						mensa={props.menu}
						isToday={props.isToday}
					/>
					{props.menu.location ? (
						<MensaInfo
							source={require('../assets/twotone_location_on_black_48dp.png')}
						>
							<Location>
								<Text>{props.menu.location}</Text>
							</Location>
						</MensaInfo>
					) : null}
				</Header>
			</SafeSideSpace>

			{link ? (
				<SafeSideSpace>
					<WebsiteTouchable onPress={() => openLink(link)}>
						<MensaInfo
							color={appearance.BLUE_TINT}
							source={require('../assets/twotone_insert_link_black_48dp.png')}
						>
							<WebsiteLink>Website</WebsiteLink>
						</MensaInfo>
					</WebsiteTouchable>
				</SafeSideSpace>
			) : null}
			{planFiltered.length ? (
				<Container style={{backgroundColor: appearance.BACKGROUND}}>
					{planFiltered.map((p, i) => {
						return (
							<SafeSideSpace key={p.title + p.description.join(',')}>
								<MealComponent
									meal={p}
									pricing={props.pricing}
									mensa={props.menu.slug}
									mensaId={props.mensaId}
								/>
								{i + 1 === planFiltered.length ? null : <Separator />}
							</SafeSideSpace>
						);
					})}
				</Container>
			) : null}
		</Wrapper>
	);
};

export const MenuPlan = connect(selectMensa)(MenuPlanUnconnected);
