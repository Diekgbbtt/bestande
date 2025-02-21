import React, {useEffect, useState} from 'react';
import {apiRequest} from '../../../core/functions/api-request';
import {RatingCore} from '../../../core/types/ratings';
import {StudentDto} from '../api/dto/student.dto';
import Rating from '../models/rating';
import Button from './button';
import {ReviewEditable} from './review-editable';
import {useHistory} from 'react-router';

const ProfileSignedIn = (props: {
	student: StudentDto;
	changeUsername: (username: string) => void;
	logout: () => void;
}) => {
	const {student, changeUsername, logout} = props;
	const [username, setUsername] = useState<string>(student.username);
	const [password, setPassword] = useState<string>('');
	const [isChangingUsername, setIsChangingUsername] = useState<boolean>(false);
	const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
	const [myRatings, setMyRatings] = useState<Rating[]>([]);
	const history = useHistory();

	const handleUsernameChange = (event) => {
		event?.preventDefault();
		setIsChangingUsername(false);
		changeUsername(username);
	};

	useEffect(() => {
		const getMyRatings = async () => {
			try {
				const myRatings: Rating[] = await apiRequest('/ratings/mine', {
					method: 'GET',
				});
				setMyRatings(myRatings);
			} catch (e) {
				console.error(e);
			}
		};
		getMyRatings();
	}, [student.email]);

	const updateRating = async (score: number, review: string, id: string) => {
		const ratingToUpdate = myRatings.find((rating) => rating._id === id);
		if (!ratingToUpdate) {
			console.error('Could not find rating to update');
			return;
		}
		try {
			const body = {score, review};
			await apiRequest(`/ratings/${ratingToUpdate._id}`, {
				method: 'PUT',
				body: JSON.stringify(body),
			});
			ratingToUpdate.score = score;
			ratingToUpdate.review = review;
			setMyRatings([...myRatings]);
		} catch (e) {
			console.error(e);
		}
	};

	const deleteRating = async (id: string) => {
		const ratingToDelete = myRatings.find((rating) => rating._id === id);
		if (!ratingToDelete) {
			console.error('Could not find rating to delete');
			return;
		}
		try {
			await apiRequest(`/ratings/${ratingToDelete._id}`, {
				method: 'DELETE',
			});
			setMyRatings(myRatings.filter((rating) => rating._id !== id));
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				maxWidth: 700,
				margin: '0 auto',
				gap: 20,
			}}
		>
			<div>
				Hallo{' '}
				<strong style={{whiteSpace: 'nowrap', wordBreak: 'keep-all'}}>
					{student.username}
				</strong>
				, <br /> du bist mit deiner UZH Email:{' '}
				<strong>{student.email}</strong> angemeldet. <br />
				Du kannst nun Bewertungen abgeben.
				{isChangingUsername ? (
					<form onSubmit={handleUsernameChange}>
						<input
							style={{
								border: '2px solid #8c99ad',
								background: '#fff',
								width: '65%',
								maxWidth: 400,
								height: 40,
								padding: '13px 12px',
								gap: 8,
								margin: '20px 0',
							}}
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Gib deinen neuen Username ein"
						/>

						<div style={{display: 'flex', gap: '20px'}}>
							<Button
								onClick={() => setIsChangingUsername(false)}
								style={{color: 'red'}}
							>
								Abbrechen
							</Button>
							<Button style={{color: 'green'}} type="submit">
								Speichern
							</Button>
						</div>
					</form>
				) : null}
				{!isChangingUsername && !isChangingPassword ? (
					<>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<div
								style={{
									display: 'flex',
									gap: 20,
									justifyContent: 'center',
									margin: '20px 0',
								}}
							>
								<Button
									style={{marginTop: 10}}
									onClick={() => setIsChangingUsername(true)}
								>
									Username ändern
								</Button>
							</div>
							<Button
								style={{
									color: 'red',
									maxWidth: '600px',
								}}
								onClick={logout}
							>
								Logout
							</Button>
						</div>
					</>
				) : null}
				<hr style={{width: '100%', color: 'black', margin: '40px 0'}} />
			</div>

			<h3 style={{margin: 0}}>Deine Reviews:</h3>

			{myRatings?.length !== 0 ? (
				<>
					<div
						style={{
							width: '100%',
							maxWidth: 500,
							display: 'flex',
							flexDirection: 'column',
							gap: '20px',
						}}
					>
						<div>
							{myRatings.map((rating) => (
								<ReviewEditable
									key={rating._id}
									myReview={rating as RatingCore}
									updateMyRating={updateRating}
									deleteMyRating={deleteRating}
									onProfilePage
								/>
							))}
						</div>
					</div>
				</>
			) : (
				<div>Erstelle eine Bewertung, die dann hier angezeigt wird.</div>
			)}
		</div>
	);
};

export default ProfileSignedIn;
