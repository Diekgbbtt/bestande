import React, {Component} from 'react';
import {Link, match} from 'react-router-dom';
import styled from 'styled-components';

import {InfiniteHits} from './infinite-hits';
import SearchResult from './search-result';
import {Menu} from 'react-instantsearch';


interface SearchPageState {
	filterOpen: boolean;
	dropdownOpen: boolean;
	activeRefinements: any;
}

interface SearchPageProps {
	match: match<{institution: string}>;
}
const StyledMenu = styled(Menu)`
	.ais-Menu-list .ais-Menu-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.ais-Menu-label {
		flex: 1;
		color: #25c568ff;
	}

	.ais-Menu-count {
		margin-left: 16px;
	}
`;

export class SearchPage extends Component<SearchPageProps, SearchPageState> {
	state: SearchPageState = {
		filterOpen: false,
		dropdownOpen: false,
		activeRefinements: null,
	};

	toggleDropdown = () => {
		this.setState((prevState) => ({
			dropdownOpen: !prevState.dropdownOpen,
		}));
	};

	render() {
		const {dropdownOpen} = this.state;
		const containerStyle: React.CSSProperties = {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',
			justifyContent: 'center',
			margin: 'auto',
			flex: 1,
			width: '100%',
			padding: 20,
			maxWidth: '1000px',
		}

		return (
			<div style={containerStyle}>
				<div style={{width: '100%'}}>
					<button
						onClick={this.toggleDropdown}
						style={{
							marginBottom: '10px',
							backgroundColor: '#f9f9f9',
							border: '1px solid #ddd',
							borderRadius: '5px',
							padding: '10px',
							cursor: 'pointer',
							display: 'flex',
							justifyContent: 'space-between',
							maxWidth: '500px',
							boxSizing: 'border-box',
							fontWeight: 'bold',
						}}
					>
						{dropdownOpen ? 'Hide Faculties ' : 'Show Faculties '}
						<span style={{marginLeft: '10px'}}>
							{dropdownOpen ? '▲' : '▼'}
						</span>
					</button>

					{dropdownOpen && (
						<StyledMenu
							attribute="faculty"
							sortBy={['count:desc', 'name:asc']}
						/>
					)}

					<InfiniteHits hitComponent={SearchResult} />
				</div>
			</div>
		);
	}
}

