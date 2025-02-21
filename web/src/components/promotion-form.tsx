import {Input, Label, Switch, Textarea} from '@jonny/rebass';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import locale from 'date-fns/locale/de';
import merge from 'lodash/merge';
import moment from 'moment';
import React from 'react';
import DatePicker from 'react-datepicker';
import TPicker from 'react-datetime';
import Geosuggest from 'react-geosuggest';
import styled from 'styled-components';
import {AppLanguage} from '../../../core/models/app-language';
import {PromotionResponse} from '../../../core/models/promotion';
import {PROMOTED_EVENT, PROMOTION} from '../../../core/models/promotion-type';
import {
	DATE,
	NONE,
	START_TIME,
	TIME,
} from '../../../core/models/time-display-type';
import Explainer from './explainer';
import HeaderEdit from './header-edit';
import {FieldContainer, FieldLeft, FieldRight} from './layout/form';
import {emptyPromotion} from './new-promotion';

const SmallRed = styled.a`
	color: red;
	font-size: 12px;
	cursor: pointer;
	display: block;
`;

type TranslationOption = {
	key: AppLanguage;
	label: string;
};

const translationOptions: TranslationOption[] = [
	{
		key: 'en',
		label: 'Englisch',
	},
];

const DPicker = DatePicker.default || DatePicker;

const mergeDates = (
	date: string | Date | number,
	time: string | Date | number
) => {
	return new Date(
		new Date(date).toDateString() + ' ' + new Date(time).toTimeString()
	).getTime();
};

const change = (
	promotion: PromotionResponse,
	key: keyof PromotionResponse,
	value: any
): PromotionResponse => {
	return {
		...promotion,
		[key]: value,
	};
};

const RemoveLabel = styled.span`
	color: red;
	cursor: pointer;
`;

const renderTranslator = (props: {
	onChange: (promotion: PromotionResponse) => void;
	promotion: PromotionResponse;
	key: 'name' | 'promoter' | 'promoter_link';
}) => {
	return translationOptions.map((t) => (
		<React.Fragment key={t.key}>
			{typeof props.promotion.translations?.[t.key]?.[props.key] ===
			'string' ? (
					<>
						<Input
							value={props.promotion.translations[t.key][props.key] || ''}
							label={`${props.key} (${t.label})`}
							name={props.key}
							onChange={({target}) => {
								const c = merge({}, props.promotion, {
									translations: {
										[t.key]: {
											[props.key]: target.value,
										},
									},
								});
								props.onChange(c);
							}}
						/>
						<SmallRed
							onClick={() =>
								props.onChange(
									merge({}, props.promotion, {
										translations: {
											[t.key]: {
												[props.key]: null,
											},
										},
									})
								)
							}
						>
							{t.label} Entfernen
						</SmallRed>
					</>
				) : (
					<button
						type="button"
						onClick={() => {
							props.onChange(
								merge({}, emptyPromotion(), props.promotion, {
									translations: {
										[t.key]: {
											[props.key]: '',
										},
									},
								})
							);
						}}
					>
						{' '}
					+ {t.label}
					</button>
				)}
		</React.Fragment>
	));
};

const PromotionForm = (props: {
	onChange: (promotion: PromotionResponse) => void;
	promotion: PromotionResponse;
}) => {
	return (
		<div>
			<HeaderEdit
				image={props.promotion.image}
				onChange={(image) => {
					props.onChange(change(props.promotion, 'image', image));
				}}
			/>
			{translationOptions.map((t) => (
				<React.Fragment key={t.key}>
					<HeaderEdit
						image={props.promotion.translations?.[t.key]?.image || null}
						onChange={(image) => {
							const c = merge({}, props.promotion, {
								translations: {
									[t.key]: {
										image,
									},
								},
							});
							props.onChange(c);
						}}
					/>
					<div>({t.label})</div>
				</React.Fragment>
			))}
			<div style={{marginBottom: 16}} />
			<Explainer>
				Lade ein hochauflösendes Bild hoch, welches automatisch passend
				zugeschnitten wird für Desktop {'&'} Mobile.
			</Explainer>
			<FieldContainer>
				<FieldLeft>
					<Input
						value={props.promotion.name || ''}
						label="Name"
						name="name"
						onChange={({target}) => {
							props.onChange(change(props.promotion, 'name', target.value));
						}}
					/>
					{renderTranslator({
						onChange: props.onChange,
						promotion: props.promotion,
						key: 'name',
					})}
				</FieldLeft>
				<FieldRight>
					<Explainer>
						{
							'Der Titel des Events. Er wird auch in der Vorschau angezeigt.	z.B: "Go-Kart-Event in Schlieren."'
						}
					</Explainer>
				</FieldRight>
			</FieldContainer>
			<FieldContainer>
				<FieldLeft>
					<Input
						value={props.promotion.promoter || ''}
						label="Promoter"
						name="promoter"
						onChange={({target}) => {
							props.onChange(change(props.promotion, 'promoter', target.value));
						}}
					/>
					{renderTranslator({
						onChange: props.onChange,
						promotion: props.promotion,
						key: 'promoter',
					})}
				</FieldLeft>
				<FieldRight>
					<Explainer>
						{
							'Der Name der Organisation, welche diesen Event bewirbt. z.B: "ABC Consulting GmbH"'
						}
					</Explainer>
				</FieldRight>
			</FieldContainer>
			<FieldContainer>
				<FieldLeft>
					<Input
						value={props.promotion.promoter_link || ''}
						label="Promoter-URL"
						name="promoter_link"
						onChange={({target}) => {
							props.onChange(
								change(props.promotion, 'promoter_link', target.value)
							);
						}}
					/>
					{renderTranslator({
						onChange: props.onChange,
						promotion: props.promotion,
						key: 'promoter_link',
					})}
				</FieldLeft>
				<FieldRight>
					<Explainer>
						{
							'Die Website der Organisation, welche diesen Event bewirbt. z.B: https://abc-consulting.com'
						}
					</Explainer>
				</FieldRight>
			</FieldContainer>
			<FieldContainer>
				<FieldLeft>
					<Textarea
						value={props.promotion.description || ''}
						name="description"
						label="Beschreibung"
						onChange={({target}) => {
							props.onChange(
								change(props.promotion, 'description', target.value)
							);
						}}
					/>
					{translationOptions.map((t) => (
						<React.Fragment key={t.key}>
							{typeof props.promotion.translations?.[t.key]?.description ===
							'string' ? (
									<>
										<Textarea
											value={
												props.promotion.translations[t.key].description || ''
											}
											label={`description (${t.label})`}
											name={'description'}
											onChange={({target}) => {
												const c = merge({}, props.promotion, {
													translations: {
														[t.key]: {
															description: target.value,
														},
													},
												});
												props.onChange(c);
											}}
										/>
										<SmallRed
											onClick={() =>
												props.onChange(
													merge({}, props.promotion, {
														translations: {
															[t.key]: {
																description: null,
															},
														},
													})
												)
											}
										>
											{t.label} Entfernen
										</SmallRed>
									</>
								) : (
									<button
										type="button"
										onClick={() => {
											props.onChange(
												merge({}, emptyPromotion(), props.promotion, {
													translations: {
														[t.key]: {
															description: '',
														},
													},
												})
											);
										}}
									>
										{' '}
									+ {t.label}
									</button>
								)}
						</React.Fragment>
					))}
				</FieldLeft>
				<FieldRight>
					<Explainer>
						Beschreibung des Events: Was statt findet, wo, wann (Programm) für
						wen.
					</Explainer>
				</FieldRight>
			</FieldContainer>
			<FieldContainer>
				<FieldLeft>
					<Label>Typ</Label>
					<br />
					<select
						value={props.promotion.type}
						onChange={(e) => {
							props.onChange(change(props.promotion, 'type', e.target.value));
						}}
					>
						<option value={PROMOTION} label="Banner" />
						<option value={PROMOTED_EVENT} label="Event" />
					</select>
				</FieldLeft>
			</FieldContainer>

			<FieldContainer>
				<FieldLeft>
					<Label>Datum</Label>
					<DPicker
						selected={moment(props.promotion.start_date).toDate()}
						locale="de"
						onChange={(date) => {
							props.onChange({
								...emptyPromotion(),
								...props.promotion,
								start_date: mergeDates(
									date.valueOf(),
									props.promotion.start_date
								),
								end_date: mergeDates(date.valueOf(), props.promotion.end_date),
							});
						}}
					/>
				</FieldLeft>
				<FieldRight>
					<Explainer>Nur ein Event pro Tag kann beworben werden.</Explainer>
				</FieldRight>
			</FieldContainer>

			<FieldContainer>
				<FieldLeft>
					<Label>Zeit</Label>
					<br />
					<div>von </div>
					<TPicker
						timeFormat="HH:mm"
						dateFormat={false}
						value={moment(props.promotion.start_date)}
						onChange={(time) => {
							props.onChange(
								change(
									props.promotion,
									'start_date',
									mergeDates(props.promotion.start_date, time.valueOf())
								)
							);
						}}
					/>
					<span>bis</span>
					<TPicker
						timeFormat="HH:mm"
						dateFormat={false}
						value={moment(props.promotion.end_date)}
						onChange={(time) => {
							props.onChange(
								change(
									props.promotion,
									'end_date',
									mergeDates(props.promotion.end_date, time.valueOf())
								)
							);
						}}
					/>
					<br />
				</FieldLeft>
				<FieldRight>
					<Explainer>Wann findet der Event statt?</Explainer>
				</FieldRight>
			</FieldContainer>

			<FieldContainer>
				<FieldLeft>
					<Label>Zeitanzeige</Label>
					{[TIME, DATE, START_TIME, NONE].map((t) => (
						<div key={t}>
							<label htmlFor={`time_display${t}`}>
								<input
									type="radio"
									value={t}
									name="time_display"
									checked={props.promotion.time_display === t}
									id={`time_display${t}`}
									onChange={() => {
										props.onChange(change(props.promotion, 'time_display', t));
									}}
									style={{marginRight: 10}}
								/>
								{t === TIME
									? 'Genaue Zeit'
									: t === DATE
										? 'Nur Tag'
										: t === START_TIME
											? 'Nur Start-Zeit'
											: 'Nichts'}
							</label>
						</div>
					))}
				</FieldLeft>
				<FieldRight>
					<Explainer>
						<em>Genaue Zeit</em>:{' '}
						{`${moment(props.promotion.start_date).format(
							'DD.MM.YYYY'
						)}, ${moment(props.promotion.start_date).format(
							'HH:mm'
						)} -  ${moment(props.promotion.end_date).format('HH:mm')}`}
						<br />
						<em>Nur Start</em>:{' '}
						{`${moment(props.promotion.start_date).format(
							'DD.MM.YYYY'
						)}, ${moment(props.promotion.start_date).format('HH:mm')} Uhr`}
						<br />
						<em>Nur Tag</em>:{' '}
						{moment(props.promotion.start_date).format('DD.MM.YYYY')}
						<br />
						<em>Nichts</em>: Kein Datum wird angezeigt
					</Explainer>
				</FieldRight>
			</FieldContainer>
			<FieldContainer>
				<FieldLeft>
					<Label>Direkt Link im Browser öffnen</Label>
					<br />
					<label htmlFor="open_in_browser">
						<input
							type="checkbox"
							name="open_in_browser"
							id="open_in_browser"
							checked={Boolean(props.promotion.open_in_browser)}
							onChange={(e) => {
								props.onChange(
									change(props.promotion, 'open_in_browser', e.target.checked)
								);
							}}
						/>
						Direkt im Browser öffnen
					</label>
				</FieldLeft>
				<FieldRight>
					<Explainer>
						Wenn ausgewählt, wird die Promoter-URL direkt im Browser geöffnet
						und die Beschreibung, Datum etc. wird nie angezeigt.
					</Explainer>
				</FieldRight>
			</FieldContainer>
			{props.promotion.type === PROMOTION ? (
				<FieldContainer>
					<FieldLeft>
						<Label>Top-Position</Label>
						<br />
						<label htmlFor="top_position">
							<input
								type="checkbox"
								name="top_position"
								id="top_position"
								checked={Boolean(props.promotion.top_position)}
								onChange={(e) => {
									props.onChange(
										change(props.promotion, 'top_position', e.target.checked)
									);
								}}
							/>
							Top-Position
						</label>
					</FieldLeft>
					<FieldRight>
						<Explainer>
							Wenn ausgewählt, wird die Werbung höher angezeigt als normal.
							Zuschlag +20%
						</Explainer>
					</FieldRight>
				</FieldContainer>
			) : null}
			{props.promotion.type === PROMOTION &&
			!props.promotion.child_of &&
			!props.promotion.alternative_of ? (
					<FieldContainer>
						<FieldLeft>
							<Label>Exklusiv</Label>
							<br />
							<label htmlFor="exclusive">
								<input
									type="checkbox"
									name="exclusive"
									id="exclusive"
									checked={Boolean(props.promotion.exclusive)}
									onChange={(e) => {
										props.onChange(
											change(props.promotion, 'exclusive', e.target.checked)
										);
									}}
								/>
							Exklusiv
							</label>
						</FieldLeft>
						<FieldRight>
							<Explainer>
							Wenn ausgewählt, werden keine Anzeigen in eigener Sache angezeigt,
							wie Social Media Werbung oder Bewertungen
							</Explainer>
						</FieldRight>
					</FieldContainer>
				) : null}

			{props.promotion.child_of || props.promotion.alternative_of ? null : (
				<FieldContainer>
					<FieldLeft>
						<Label>Ort</Label>
						{props.promotion.location ? (
							<div>
								{props.promotion.location.address}{' '}
								<RemoveLabel
									onClick={() =>
										props.onChange({
											...emptyPromotion(),
											...props.promotion,
											location: null,
										})
									}
								>
									Entfernen
								</RemoveLabel>
							</div>
						) : null}
						<Geosuggest
							placeholder="Gib eine Addresse ein..."
							country="ch"
							onSuggestSelect={(select) => {
								props.onChange({
									...emptyPromotion(),
									...props.promotion,
									location: {
										latitude: select.location.lat,
										longitude: select.location.lng,
										address: select.gmaps.formatted_address,
									},
								});
							}}
						/>
					</FieldLeft>
					<FieldRight>
						<Explainer>
							Ein Ort kann optional hinzugefügt werden, dann wird eine Karte in
							der App angezeigt.
						</Explainer>
					</FieldRight>
				</FieldContainer>
			)}
			{props.promotion.child_of || props.promotion.alternative_of ? null : (
				<FieldContainer>
					<FieldLeft>
						<Input
							value={props.promotion.password || ''}
							label="Passwort"
							name="_password"
							autoComplete="bestande-ad-analytics-password"
							onChange={({target}) => {
								props.onChange(
									change(props.promotion, 'password', target.value)
								);
							}}
						/>
					</FieldLeft>
					<FieldRight>
						<Explainer>
							{
								'Das Passwort für die Analytics, mit der der Promoter auf sie zugreifen kann.'
							}
						</Explainer>
					</FieldRight>
				</FieldContainer>
			)}
			{props.promotion.child_of || props.promotion.alternative_of ? null : (
				<FieldContainer>
					<FieldLeft>
						<Label>Geplant</Label>
						<br />
						<label htmlFor="scheduled">
							<input
								type="checkbox"
								name="scheduled"
								id="scheduled"
								checked={Boolean(props.promotion.scheduled)}
								onChange={(e) => {
									props.onChange({
										...emptyPromotion(),
										...props.promotion,
										scheduled: e.target.checked,
										...(props.promotion.scheduled_start
											? {}
											: {
												scheduled_start: Date.now(),
												scheduled_end: Date.now(),
											  }),
									});
								}}
							/>
							Geplant
						</label>
					</FieldLeft>
					<FieldRight>
						<Explainer>
							Wenn ausgewählt, wird die Werbung automatisch auf- und
							abgeschaltet.
						</Explainer>
					</FieldRight>
				</FieldContainer>
			)}
			{props.promotion.child_of || props.promotion.alternative_of ? null : props
				.promotion.scheduled ? (
					<FieldContainer>
						<FieldLeft>
							<Label>Aufschaltung Zeitfenster</Label>
							<br />
							<span>von </span>
							<br />
							<DPicker
								selected={moment(props.promotion.scheduled_start).toDate()}
								locale="de"
								onChange={(date) => {
									props.onChange({
										...emptyPromotion(),
										...props.promotion,
										scheduled_start: mergeDates(
											date.valueOf(),
										props.promotion.scheduled_start as number
										),
									});
								}}
							/>
							<TPicker
								timeFormat="HH:mm"
								dateFormat={false}
								value={moment(props.promotion.scheduled_start)}
								onChange={(time) => {
									props.onChange(
										change(
											props.promotion,
											'scheduled_start',
											mergeDates(
											props.promotion.scheduled_start as number,
											time.valueOf()
											)
										)
									);
								}}
							/>
							<div>bis</div>
							<DPicker
								selected={moment(props.promotion.scheduled_end).toDate()}
								locale="de"
								onChange={(date) => {
									props.onChange({
										...emptyPromotion(),
										...props.promotion,
										scheduled_end: mergeDates(
											date.valueOf(),
										props.promotion.scheduled_end as number
										),
									});
								}}
							/>
							<TPicker
								timeFormat="HH:mm"
								dateFormat={false}
								value={moment(props.promotion.scheduled_end)}
								onChange={(time) => {
									props.onChange(
										change(
											props.promotion,
											'scheduled_end',
											mergeDates(
											props.promotion.scheduled_end as number,
											time.valueOf()
											)
										)
									);
								}}
							/>
							<br />
						</FieldLeft>
						<FieldRight>
							<Explainer>
							Zeigt die Werbung von{' '}
								{format(
									new Date(props.promotion.scheduled_start as number),
									'dd.MM.yyyy HH:mm'
								)}{' '}
							to{' '}
								{format(
									new Date(props.promotion.scheduled_end as number),
									'dd.MM.yyyy HH:mm'
								)}
							. Zeitdauer:{' '}
								{formatDistance(
									new Date(props.promotion.scheduled_end as number).getTime(),
									new Date(props.promotion.scheduled_start as number).getTime(),
									{
										includeSeconds: true,
										locale,
									}
								)}
							</Explainer>
						</FieldRight>
					</FieldContainer>
				) : (
					<FieldContainer>
						<FieldLeft>
							<Label>Live</Label>
							<br />
							<Switch
								checked={props.promotion.live}
								onClick={() =>
									props.onChange(
										change(props.promotion, 'live', !props.promotion.live)
									)
								}
							/>
						</FieldLeft>
						<FieldRight>
							<Explainer>
							Ist ein Event {"'"}Live{"'"}, wird er in der App angezeigt.
							</Explainer>
						</FieldRight>
					</FieldContainer>
				)}
		</div>
	);
};

export default PromotionForm;
