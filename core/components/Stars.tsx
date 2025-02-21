import StarRating from 'react-native-star-rating';
import styled from 'styled-components';
import {Colors} from '../functions/Colors';

type StarProps = {
	size?: number;
	emptyStar?: any;
	selectedStar?: (star: number) => void;
	rating: number | null;
	emptyStarColor?: string;
	disabled?: boolean;
};

const Stars = styled(StarRating).attrs((props) => ({
	emptyStar:
		props.theme.THEME === 'dark'
			? require('../assets/star-empty-transparent.png')
			: require('../assets/star-full-transparent.png'),
	fullStar: require('../assets/star-full.png'),
	halfStar: require('../assets/half-star.png'),
	starColor: Colors.Orange,
	starSize: props.size || 32,
}))<StarProps>``;

export default Stars;
