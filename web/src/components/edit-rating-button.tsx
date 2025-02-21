import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
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
import Modal from 'react-modal';
import {ApiResponse} from '../../../core/reducers/api';
import {CreateRatingDto} from '../api/dto/ratings.dto';

const EditRatingButtonWithModal = (props: {
	previousScore: number;
	previousReview: string;
	submitEdit: (score: number, review: string) => void;
	cancelEdit: () => void;
}) => {
	const isMobile = useMediaQuery('(max-width:800px)');

	const [score, setScore] = useState<number | null>(props.previousScore);
	const [review, setReview] = useState<string>(props.previousReview);
	const [hover, setHover] = React.useState(-1);

	const SubmitButton = styled(Button)`
		&& {
			background-color: #2ecc71;
			color: white;
			border: none;
			cursor: pointer;
			transition: background-color 0.3s ease;
			margin-top: 10px;
			padding: 10px 20px;
			font-size: 16px;
			&:hover {
				background-color: #08a64b;
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
			padding: 10px 20px;
			font-size: 16px;
			margin-top: 10px;
		}
	`;

	const CancelButton = styled(Button)`
		&& {
			background-color: white;
			color: #2ecc71;
			border-color: #2ecc71;
			cursor: pointer;
			transition: background-color 0.3s ease;
			padding: 10px 20px;
			font-size: 16px;
			margin-top: 10px;
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

	const handleSubmit = () => {
		if (!score) {
			props.cancelEdit();
			return;
		}
		props.submitEdit(score, review);
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
					paddingTop: '0px',
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
					justifyContent: 'space-between',
				}}
			>
				<CancelButton variant="outlined" onClick={props.cancelEdit}>
					Abbrechen
				</CancelButton>
				{score === null ? (
					<SubmitButtonDisabled disabled> Posten </SubmitButtonDisabled>
				) : (
					<SubmitButton onClick={handleSubmit}>Posten</SubmitButton>
				)}
			</div>
		</div>
	);
};

export default EditRatingButtonWithModal;
