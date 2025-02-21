import React from 'react';
import {NavLink} from 'react-router-dom';

const styles = {
	wrapper: {
		display: 'flex',
		alignItems: 'center',
		marginRight: 25,
	},
	logo: {
		marginLeft: -6,
	},
	label: {
		fontWeight: 'bold',
		color: 'white',
		marginRight: 6,
		marginLeft: 3,
	},
};

const Logo = () => {
	return (
		<NavLink
			style={styles.wrapper} // eslint-disable-line react/forbid-component-props
			to="/"
		>
			<img
				src="/static/logo-white.png"
				style={styles.logo}
				width={36}
				height={36}
			/>
		</NavLink>
	);
};

export default Logo;
