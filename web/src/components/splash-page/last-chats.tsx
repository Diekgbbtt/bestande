import {format} from 'date-fns/esm';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {apiRequest} from '../../../../core/functions/api-request';
import {mapToUniSlug} from '../../../../core/functions/uni-slug';
import {mapAppearance} from '../../../../core/functions/use-appearance';
import {ORANGE} from '../../../../core/models/colors';
import {
	LastMessagesResponse,
	ModuleIdAndName,
} from '../../../../core/types/types';
import {User} from '../../../../core/types/user-state';
import {shouldShowMessageText} from '../../helpers/should-show-message-text';

const Outer = styled.div`
	width: 100vw;
	overflow-x: scroll;
	background: rgba(0, 0, 0, 0.02);
`;

const Title = styled.div`
	background: rgba(0, 0, 0, 0.02);
	padding-left: 30px;
	padding-top: 16px;
	color: rgba(0, 0, 0, 0.8);
	font-weight: bold;
	font-size: 18px;
`;

const Container = styled.div`
	min-height: 199px;
	flex-direction: row;
	display: inline-flex;
	padding-left: 20px;
	padding-right: 20px;
	border-bottom: 1px solid rgba(0, 0, 0, 0);
`;

const Card = styled.div`
	width: 300px;
	display: inline-block;
	margin-left: 10px;
	margin-right: 10px;
	margin-top: 10px;
	margin-bottom: 20px;
	background: white;
	box-shadow: 0 0px 2px rgba(0, 0, 0, 0.14);
	border-radius: 3px;
	font-family: Roboto;
`;

const MessageContent = styled.div`
	padding-left: 12px;
	padding-right: 12px;
	padding-top: 10px;
	padding-bottom: 10px;
	height: 120px;
	overflow: auto;
	&:hover {
		background-color: rgba(0, 0, 0, 0.01);
	}
`;

const MessageText = styled.div`
	font-size: 15px;
	line-height: 20px;
`;

const MessageCourse = styled.div`
	padding-left: 12px;
	padding-right: 12px;
	padding-bottom: 5px;
	padding-top: 8px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.08);
	&:hover {
		background-color: rgba(0, 0, 0, 0.01);
	}
`;

const CourseTitle = styled.div`
	font-size: 15px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
`;

const CourseSubtitle = styled.div`
	margin-top: -6px;
	color: rgba(0, 0, 0, 0.6);
	font-size: 14px;
`;

const CourseRating = styled.span`
	color: ${ORANGE};
	i {
		font-size: 14px;
		vertical-align: middle;
		margin-top: -2px;
	}
`;

const MessageAuthor = styled.div`
	font-weight: bold;
	font-size: 14px;
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;
`;

const University = styled.span`
	font-weight: bold;
	font-size: 12px;
	color: ${mapAppearance('light').COUNTS_INDICATOR_LEGEND};
`;

const MessageTime = styled.div`
	color: rgba(0, 0, 0, 0.6);
	font-size: 14px;
`;

export const LastChats = () => {
	const [data, setData] = useState<null | LastMessagesResponse>(null);
	const getMessages = React.useCallback(async () => {
		const messages = await apiRequest<LastMessagesResponse>(
			'/chat/last-messages'
		);
		setData(messages);
	}, []);

	useEffect(() => {
		getMessages();
	}, [getMessages]);

	return (
		<div>
			<Title>Darüber reden Leute:</Title>
			<Outer>
				<Container>
					{data
						? data.messages
							.filter((m) => shouldShowMessageText(m))
							.map((m) => {
								const user = data.users.find(
									(u) => u.id === m.userId
								) as User;
								const course = data.courses.find(
									(c) =>
										c.uni_identifier === m.uni_identifier &&
											c.university === m.university
								) as ModuleIdAndName;
								return (
									<Link
										key={m._id}
										to={`/${mapToUniSlug(course.university)}/${
											course.uni_identifier
										}`}
										style={{
											color: 'inherit',
											height: '100%',
										}}
									>
										<Card>
											<MessageCourse>
												<CourseTitle>
													{course.short_name}{' '}
													<University>{course.university}</University>
												</CourseTitle>
												<CourseSubtitle>
													{course.userCount?.all ? (
														<span style={{marginRight: 5}}>
															{course.userCount.all?.toLocaleString()}{' '}
																App-Nutzer
														</span>
													) : null}

													<CourseRating>
														<i className="material-icons">star</i>{' '}
														{course.ratingSummary.average?.toFixed(1)}
													</CourseRating>
												</CourseSubtitle>
											</MessageCourse>
											<Link
												to={`/${mapToUniSlug(course.university)}/${
													course.uni_identifier
												}/chat`}
												style={{
													color: 'inherit',
												}}
											>
												<MessageContent>
													<Row>
														<MessageAuthor>{user.username}</MessageAuthor>
														<div style={{flex: 1}} />
														<MessageTime>
															{format(m.createdAt, 'HH:mm')}
														</MessageTime>
													</Row>
													<MessageText>{m.text}</MessageText>
												</MessageContent>
											</Link>
										</Card>
									</Link>
								);
							})
						: null}
				</Container>
			</Outer>
		</div>
	);
};
