import React from 'react';
import {match, Route} from 'react-router-dom';
import {
	onlyDesktop,
	onlyMobile,
} from '../../../core/components/layout/responsive';
import AdminMenu from './admin-menu';
import {AdminNeeded} from './admin-needed';
import {AdminPromotions} from './admin-promotions';
import AdminRatings from './admin-ratings';
import AdminStart from './admin-start';
import AdminStats from './admin-stats';
import AdminTasks from './admin-tasks';
import {rightPane} from './layout/pane';
import {NewPromotion} from './new-promotion';
import {PromotionEdit} from './promotion-edit';

const AdminMenuOnlyMobile = onlyMobile(AdminMenu);
const AdminMenuNoMobile = onlyDesktop(AdminMenu);
const AdminStartNoMobile = onlyDesktop(rightPane(AdminStart));

const Admin = (props: {match: match}) => {
	return (
		<AdminNeeded>
			<div style={{display: 'flex', flexDirection: 'row', flex: 1}}>
				<Route exact path={props.match.path} component={AdminMenuOnlyMobile} />
				<Route path={props.match.path} component={AdminMenuNoMobile} />
				<Route exact path={props.match.path} component={AdminStartNoMobile} />
				<Route
					exact
					path={`${props.match.path}/stats`}
					component={rightPane(AdminStats)}
				/>
				<Route
					exact
					path={`${props.match.path}/tasks`}
					component={rightPane(AdminTasks)}
				/>
				<Route
					exact
					path={`${props.match.path}/ratings`}
					component={rightPane(AdminRatings)}
				/>
				<Route
					exact
					path={`${props.match.path}/promotions`}
					component={rightPane(AdminPromotions)}
				/>
				<Route
					exact
					path={`${props.match.path}/promotions/new`}
					component={rightPane(NewPromotion)}
				/>
				<Route
					exact
					path={`${props.match.path}/promotions/:id([a-f\\d]{24})`}
					component={rightPane(PromotionEdit)}
				/>
			</div>
		</AdminNeeded>
	);
};

export default Admin;
