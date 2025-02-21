import {
	Box,
	Button,
	InputLabel,
	Rating,
	styled,
	TextField,
	useMediaQuery,
} from '@mui/material';
import React, {useState} from 'react';
import {ApiResponse} from '../../../core/reducers/api';

const AddRatingButtonWithModal = (props: {
	module: ApiResponse;
	createRating: (score: number, review: string) => void;
}) => {
	const {uni_identifier, university} = props.module;
	const [score, setScore] = useState<number | null>(null);
	const [review, setReview] = useState<string>('');
	const [hover, setHover] = React.useState(-1);

	const resetValues = () => {
		setScore(null);
		setReview('');
	};

	const SubmitButton = styled(Button)`
		&& {
			background-color: #2ecc71;
			color: white;
			border: none;
			cursor: pointer;
			transition: background-color 0.3s ease;
			margin: 0 10px;
			padding: 10px 20px;
			font-size: 16px;
			
			&:hover {
				background-color: #08a64b;
			}

			@media only screen and (max-width: 600px) {
				font-size: 12px;
			}
		}
	`;

	const SubmitButtonDisabled = styled(Button)`
		&& {
			background-color: #e7e8e8;
			color: #a6a8a9;
			border: none;
			cursor: pointer;
			transition: background-color 0.3s ease;
			margin: 0 10px;
			padding: 10px 20px;
			font-size: 16px;

			@media only screen and (max-width: 600px) {
				font-size: 12px;
			}
		}
	`;

	const CancelButton = styled(Button)`
		&& {
			background-color: white;
			color: #2ecc71;
			border-color: #2ecc71;
			cursor: pointer;
			transition: background-color 0.3s ease;
			margin: 0 10px;
			padding: 10px 20px;
			font-size: 16px;
			
			@media only screen and (max-width: 600px) {
				font-size: 12px;
				
			}

			&:hover {
				background-color: #2ecc711b;
			}

			&:disabled {
				background-color: white;
				color: #a6a8a9;
				border-color: #a6a8a9;
				cursor: default;
			}
		}
	`;

	//   const GradeSlider = styled(Slider)({
	//     color:'#52af77'
	// });

	//   const marks
	//
	// = [ {
	//   value: 1,
	//   label: '1',
	// }, {
	//   value: 4,
	//   label: '4',
	// }, {
	//   value: 6,
	//   label: '6',
	// } ];

	const labels: {[index: string]: string} = {
		1: '1',
		2: '2',
		3: '3',
		4: '4',
		5: '5',
	};

	function getLabelText(value: number) {
		return `${value}
    Star$
    {
        value !== 1 ? 's' : ''
    }
, ${labels[value]}
    `;
	}

	const submitRating = async () => {
		if (!score) {
			return;
		}
		await props.createRating(score, review);
		resetValues();
	};

	return (
		<div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginBottom: '20px',
				}}
			></div>

			<Box
				sx={{
					alignItems: 'center',
					justifyContent: 'center',
					display: 'flex',
					padding: '20px',
				}}
			>
				<Rating
					name="hover-feedback"
					getLabelText={getLabelText}
					size="large"
					precision={1}
					value={score}
					onChange={(event, newValue) => {
						setScore(newValue);
					}}
					onChangeActive={(event, newHover) => {
						setHover(newHover);
					}}
				/>
				{score !== null && (
					<InputLabel
						sx={{
							ml: 1,
							fontSize: 'large',
							width: '30px',
						}}
					>
						{labels[hover !== -1 ? hover : score]}
					</InputLabel>
				)}
			</Box>
			{/*<Box sx={{
                    alignItems: 'center',
                    display: 'block',
                    padding: '40px'
                }}>
                    <Typography gutterBottom>Note</Typography>
                    <GradeSlider
                        marks={marks}
                        step={0.25}
                        min={1}
                        max={6}
                        defaultValue={4}
                        aria-label="Always visible"
                        valueLabelDisplay="on"
                    />
                </Box>*/}
			<Box
				sx={{
					alignItems: 'center',
					display: 'flex',
				}}
			>
				<TextField
					fullWidth
					multiline
					maxRows={10}
					id="outlined-basic"
					label="Kommentar"
					variant="outlined"
					value={review}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setReview(event.target.value);
					}}
					inputProps={{maxLength: 4096}}
				/>
			</Box>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					padding: '15px',
				}}
			>
				<CancelButton
					disabled={!review && !score}
					variant="outlined"
					onClick={resetValues}
				>
					Abbrechen
				</CancelButton>
				{score === null ? (
					<SubmitButtonDisabled disabled> Posten </SubmitButtonDisabled>
				) : (
					<SubmitButton onClick={submitRating}>Posten</SubmitButton>
				)}
			</div>
		</div>
	);
};

export default AddRatingButtonWithModal;
