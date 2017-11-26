import React, { Component } from 'react'
import { withApollo } from 'react-apollo'

import { ALL_LINKS_SEARCH_QUERY } from '../queries'

import Link from './Link'

class Search extends Component {
	state = {
		links: [],
		searchText: ''
	}
	
	_handleChangeSearchField = (value) =>
		this.setState({ searchText: value })
	
	_handleSubmitSearchForm = (e) => {
		e.preventDefault()
		
		const executeSearch = async () => {
			const { searchText } = this.state
			
			const result = await this.props.client.query({
				query: ALL_LINKS_SEARCH_QUERY,
				variables: { searchText }
			})
			
			const links = result.data.allLinks
			
			this.setState({ links })
		}
		
		return executeSearch()
	}
	
	render() {
		return (
			<div>
				<form onSubmit={e => this._handleSubmitSearchForm(e)}>
					Search
					<input
						type="text"
						onChange={
							e => this._handleChangeSearchField(e.target.value)
						} />
					<button type="submit">OK</button>
				</form>
				{this.state.links.map((link, index) =>
					<Link {...{key: link.id, index, link}} />
				)}
			</div>
		)
	}
}

export default withApollo(Search)