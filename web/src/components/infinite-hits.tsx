import React, {useEffect, useRef} from 'react';
import {useInfiniteHits} from 'react-instantsearch';
import styled from 'styled-components';

const SearchResult = styled.li`
	border: 1px solid rgba(46, 204, 113, 0.2);
	border-radius: 5px; 
	margin: 10px auto;
	padding: 0 10px;
	background-color: rgba(46, 204, 113, 0.05);

	&:hover {
		background-color: rgba(46, 204, 113, 0.2);
	}
`

export function InfiniteHits({hitComponent: HitComponent, ...props}) {
	const {hits, isLastPage, showMore} = useInfiniteHits(props);
	const sentinelRef = useRef(null);

	useEffect(() => {
		if (sentinelRef.current !== null) {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isLastPage) {
						showMore();
					}
				});
			});

			observer.observe(sentinelRef.current);

			return () => {
				observer.disconnect();
			};
		}
	}, [isLastPage, showMore]);

	return (
		<div>
			<ul
				style={{
					listStyle: 'none',
					margin: 0,
					padding: 0,
				}}
			>
				{hits.map((hit) => (
					<SearchResult key={hit.objectID}>
						<HitComponent hit={hit} />
					</SearchResult>
				))}
				<li
					className="ais-InfiniteHits-sentinel"
					ref={sentinelRef}
					aria-hidden="true"
					style={{
						listStyle: 'none',
					}}
				/>
			</ul>
		</div>
	);
}
