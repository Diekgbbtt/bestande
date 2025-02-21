import React, {ReactNode, useEffect, useImperativeHandle, useRef} from 'react';
import styled from 'styled-components';
import {desktop, mobile} from '../layout/responsive';

interface IProps {
	onClosed?: () => void;
	webTitle?: ReactNode;
	footer?: ReactNode;
}

const Container = styled.div`
	position: fixed;
	z-index: 5;
	background-color: rgba(0, 0, 0, 0.4);
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Content = styled.div`
	margin: auto;
	background-color: white;
	flex: 1;
	border: 1px solid rgba(0, 0, 0, 0.1);
	flex-direction: column;
	display: flex;
	${desktop`
	max-width: 400px;
	`}
	${mobile`
		width: 100%;
		height: 100%;
	`}
`;

const Inner = styled.div`
	overflow: auto;
	${desktop`
	max-height: 500px;
	`}
	${mobile`
	flex: 1
	`}
`;

// ts-unused-exports:disable-next-line
export const WebModal: React.FC<IProps> = React.forwardRef(
	({onClosed, webTitle, children, footer}, ref) => {
		const contentRef = useRef<HTMLDivElement>(null);

		const escListener = React.useCallback(
			(e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					onClosed?.();
				}
			},
			[onClosed]
		);

		useImperativeHandle(ref, () => ({
			close: () => {
				onClosed?.();
			},
			open: () => {
				// noop
			},
		}));

		useEffect(() => {
			window.addEventListener('keyup', escListener);
			return () => {
				window.removeEventListener('keyup', escListener);
			};
		}, [escListener]);
		return (
			<Container
				onClick={(e) => {
					const contains = contentRef.current?.contains(e.target as Node);
					if (!contains) {
						onClosed?.();
					}
				}}
			>
				<Content ref={contentRef}>
					{webTitle ? webTitle : null}
					<Inner>{children}</Inner>
					{footer ? footer : null}
				</Content>
			</Container>
		);
	}
);
