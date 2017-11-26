import React, { Component } from "react"
import { graphql }          from "react-apollo"

import Link from "./Link"

import { ALL_LINKS_QUERY }                        from "../queries"
import { LINKS_PER_PAGE }                         from '../constants'
import { LINKS_SUBSCRIPTION, VOTES_SUBSCRIPTION } from "../subsrictpions"

class LinkList extends Component {
	componentDidMount() {
		this._subscribeToNewLinks()
		this._subscribeToNewVotes()
	}
	
	_subscribeToNewVotes = () => {
		this.props.allLinksQuery.subscribeToMore({
			document: VOTES_SUBSCRIPTION,
			updateQuery: (previous, response) => {
				const resVoteLink = response.subscriptionData.data.Vote.node.link
				
				const allLinks =  previous.allLinks.map(
					link => link.id === resVoteLink.id ? resVoteLink : link
				)
				
				return { ...previous, allLinks }
			}
		})
	}
	
	_subscribeToNewLinks = () => {
		this.props.allLinksQuery.subscribeToMore({
			document: LINKS_SUBSCRIPTION,
			updateQuery: (storeData, response) => {
				const newLink = response.subscriptionData.data.Link.node
				const allLinks = [...storeData.allLinks, newLink]
				
				return { ...storeData, allLinks }
			}
		})
	}
	
	_updateCacheAfterVote = (store, response, linkId) => {
		const isNewPage = this.props.location.pathname.includes('new')
		const page      = parseInt(this.props.match.params.page, 10)
		
		const skip      = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
		const first     = isNewPage ? LINKS_PER_PAGE : 100
		const orderBy   = isNewPage ? 'createdAt_DESC' : null
		
		const votes = response.data.createVote.link.votes
		
		const storeData = store.readQuery({
			query: ALL_LINKS_QUERY,
			variables: { first, skip, orderBy }
		})
		
		const allLinks = storeData.allLinks
			.map(link => link.id === linkId ? {...link, votes } : link)
		
		store.writeQuery({ query: ALL_LINKS_QUERY, data: {...storeData, allLinks} })
	}
	
	_getLinksToRender = (isNewPage) => {
		if (isNewPage) return this.props.allLinksQuery.allLinks
		
		const rankedLinks = this.props.allLinksQuery.allLinks.slice()
		rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
		return rankedLinks
	}
	
	_nextPage = () => {
		const page = parseInt(this.props.match.params.page, 10)
		if (page <= this.props.allLinksQuery._allLinksMeta.count / LINKS_PER_PAGE) {
			const nextPage = page + 1
			this.props.history.push(`/new/${nextPage}`)
		}
	}
	
	_previousPage = () => {
		const page = parseInt(this.props.match.params.page, 10)
		if (page > 1) {
			const previousPage = page - 1
			this.props.history.push(`/new/${previousPage}`)
		}
	}
	
	render() {
		const { loading, error } = this.props.allLinksQuery
		
		if (loading) return <div>...loading</div>
		if (error) return <div>server error</div>
		
		const isNewPage = this.props.location.pathname.includes('new')
		const linksToRender = this._getLinksToRender(isNewPage)
		const page = parseInt(this.props.match.params.page, 10)
		
		return (
			<div>
				<div>
					{linksToRender.map((link, index) => (
						<Link
							key={link.id}
							index={page ? (page - 1) * LINKS_PER_PAGE + index : index}
							updateStoreAfterVote={this._updateCacheAfterVote}
							link={link}
						/>
					))}
					{isNewPage &&
					<div className='flex ml4 mv3 gray'>
						<div className='pointer mr2' onClick={() => this._previousPage()}>
							Previous
						</div>
						<div
							className='pointer' onClick={() => this._nextPage()}>
							Next
						</div>
					</div>
					}
				</div>
			</div>
		)
	}
}

export default graphql(ALL_LINKS_QUERY, {
	name: 'allLinksQuery',
	options: (ownProps) => {
		const page = parseInt(ownProps.match.params.page, 10)
		const isNewPage = ownProps.location.pathname.includes('new')
		const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
		const first = isNewPage ? LINKS_PER_PAGE : 100
		const orderBy = isNewPage ? 'createdAt_DESC' : null
		return {
			variables: { first, skip, orderBy }
		}
	}
})(LinkList)