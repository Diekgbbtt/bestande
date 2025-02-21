import React from 'react';

const ValidationProblems = ({
	problems,
	message,
}: {
	problems: string[];
	message: string;
}) => {
	return (
		<div>
			<span>{message}</span>
			<ul>
				{problems.map((problem) => {
					return <li key={problem}>{problem}</li>;
				})}
			</ul>
		</div>
	);
};

export default ValidationProblems;
