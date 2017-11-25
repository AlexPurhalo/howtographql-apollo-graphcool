import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import Link from './Link'

import { ALL_LINKS_QUERY } from '../queries'

class LinkList extends Component {
	_updateCacheAfterVote = (store, response, linkId) => {
		const votes = response.data.createVote.link.votes
		const storeData = store.readQuery({ query: ALL_LINKS_QUERY })
		
		const allLinks = storeData.allLinks
			.map(link => link.id === linkId ? {...link, votes } : link)
		
		store.writeQuery({ query: ALL_LINKS_QUERY, data: {...storeData, allLinks} })
	}
	
	render() {
		const { loading, error, allLinks: linksToRender } = this.props.allLinksQuery
		
		if (loading) return <div>...loading</div>
		if (error) return <div>server error</div>
		
		return (
			<div>
				{linksToRender.map((link, index) =>
					<Link {...{
						key: index,
						link,
						index,
						updateStoreAfterVote: this._updateCacheAfterVote
					}} />
				)}
			</div>
		)
	}
}

export default graphql(ALL_LINKS_QUERY, { name: 'allLinksQuery' })(LinkList)