import styled, {css} from 'styled-components';

const sizes = {
	mobile: 800,
};

export const mobile = (arg0, ...args) => css`
	@media (max-width: ${sizes.mobile}px) {
		${css(arg0, ...args)};
	}
`;

export const desktop = (arg0, ...args) => css`
	@media (min-width: ${sizes.mobile + 1}px) {
		${css(arg0, ...args)};
	}
`;

export const onlyMobile = (comp) => {
	return styled(comp)`
		${desktop`display: none`};
	`;
};

export const onlyDesktop = (comp) => {
	return styled(comp)`
		${mobile`display: none`};
	`;
};
