import {Heading, Space} from '@jonny/rebass';
import Tooltip from '@jonny/tooltip';
import isEqual from 'lodash/isEqual';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, Prompt, Redirect} from 'react-router-dom';
import {ThunkDispatch} from 'redux-thunk';
import {savePromotion} from '../../../core/actions/promotions';
import {
	ButtonContainer,
	HeaderContainer,
	TextContainer,
} from '../../../core/components/header-container';
import {PromotionResponse} from '../../../core/models/promotion';
import validatePromotion from '../helpers/validate-promotion';
import Button from './button';
import Padded from './layout/padded';
import PromotionForm from './promotion-form';
import {PromotionRequired} from './promotion-required';
import ValidationProblems from './validation-problems';

class PromotionEditView extends Component<
	{
		promotion: PromotionResponse;
		saving: boolean;
		className: string;
		save: (promotion: PromotionResponse, cb: () => void) => void;
	},
	{
		promotion: PromotionResponse;
		saved: boolean;
	}
> {
	constructor(props) {
		super(props);
		// eslint-disable-next-line react/state-in-constructor
		this.state = {
			promotion: props.promotion,
			saved: false,
		};
	}

	isSaved() {
		return isEqual(this.state.promotion, this.props.promotion);
	}

	renderProblems() {
		const problems = this.validate();
		if (problems.length === 0) {
			return null;
		}

		return (
			<ValidationProblems
				problems={problems}
				message="Die Werbung kann nicht gespeichert werden:"
			/>
		);
	}

	validate() {
		return validatePromotion(this.state.promotion);
	}

	saveButtonLabel() {
		if (this.props.saving) {
			return 'Speichern...';
		}

		if (this.isSaved()) {
			return 'Gespeichert';
		}

		return 'Speichern';
	}

	render() {
		if (this.state.saved) {
			return <Redirect to="/admin/promotions" />;
		}

		return (
			<div className={this.props.className}>
				<Padded style={{background: 'white'}}>
					<HeaderContainer>
						<TextContainer>
							<Heading>Werbung bearbeiten</Heading>
						</TextContainer>
						<ButtonContainer>
							<Link to="/admin/promotions">
								<Button>Zurück</Button>
							</Link>
							<Space x={1} />
							<Tooltip
								preferredPlacement="bottom-end"
								tip={this.renderProblems()}
							>
								<div>
									<Button
										type="button"
										disabled={Boolean(
											this.validate().length > 0 ||
												this.props.saving ||
												this.isSaved()
										)}
										onClick={() =>
											this.props.save(this.state.promotion, () => {
												this.setState({
													saved: true,
												});
											})
										}
									>
										{this.saveButtonLabel()}
									</Button>
								</div>
							</Tooltip>
						</ButtonContainer>
					</HeaderContainer>
				</Padded>
				<Padded>
					<PromotionForm
						promotion={this.state.promotion}
						onChange={(promotion) => {
							this.setState({promotion});
						}}
					/>
					<Prompt
						when={!this.isSaved()}
						message={() =>
							'Die Werbung hat ungespeicherte Änderungen. Möchtest du wirklich die Seite verlassen?'
						}
					/>
				</Padded>
			</div>
		);
	}
}

const PromotionEditContainer = connect(
	null,
	(dispatch: ThunkDispatch<any, any, any>) => ({
		save: (promotion: PromotionResponse, cb: () => void) => {
			return dispatch(savePromotion(promotion, cb));
		},
	})
)(PromotionEditView);

export const PromotionEdit = (props) => (
	<PromotionRequired {...props.match.params} {...props}>
		{/**
			// @ts-expect-error */}
		<PromotionEditContainer />
	</PromotionRequired>
);
