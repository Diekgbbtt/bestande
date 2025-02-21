import React, {ReactElement, useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {ErrorWithStatusCode} from '../../../core/functions/api-request';
import {useWebState} from '../../../core/functions/use-app-state';
import {Institution} from '../../../core/models/credit';
import {fetchModule} from '../actions/modules';
import {getModule, getSemester} from '../reducers/modules';
import {ErrorCode} from './errorcode';
import {Spinner} from './spinner';
import { mapToUniversity } from '../../../core/functions/uni-slug';

type OwnProps = {
	institution: string;
	semester: string;
	id: string;
	className: string;
};

export const ModuleRequired: React.FC<OwnProps> = (props) => {
	const {id, semester, institution, className} = props;
	
	const {children, ...otherProps} = props;

	const dispatch = useDispatch();
	const credit = useWebState((state) =>
		getModule(state, institution + '/' + id)
	);
	const semesterResponse = useWebState((state) =>
		getSemester(state, institution + '/' + id, semester)
	);

	const doFetchModule = useCallback(
		(inst: Institution, uni_identifier: string) => {
			dispatch(fetchModule(inst, uni_identifier));
		},
		[dispatch]
	);

	useEffect(() => {
		if (!credit.data) {
			doFetchModule( mapToUniversity(institution), id);
		}
	}, [doFetchModule, id, credit.data, institution]);
	if (credit.loading) {
		return (
			<div className={className}>
				<Spinner />
			</div>
		);
	}

	if (credit.error) {
		return (
			<div className={className} style={{display: 'flex'}}>
				<ErrorCode error={credit.error} />
			</div>
		);
	}

	if (!semesterResponse) {
		const error: ErrorWithStatusCode = new Error(
			`Dieses Modul findet nicht in ${semester} statt.`
		);
		error.statusCode = 404;
		return (
			<div className={className} style={{display: 'flex'}}>
				<ErrorCode error={error} />
			</div>
		);
	}

	return React.cloneElement(children as ReactElement, {
		...otherProps,
		semesterResponse,
		module: credit.data,
		saving: credit.saving,
	});
};
