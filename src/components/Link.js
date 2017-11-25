import React, { Component }      from 'react'
import { graphql }               from 'react-apollo'

import { CREATE_VOTE_MUTATION }  from '../queries'
import { GC_USER_ID }            from '../constants'
import { timeDifferenceForDate } from '../utils'

class Link extends Component {
	render() {
		const userId = localStorage.getItem(GC_USER_ID)
		
		return (
			<div className='flex mt2 items-start'>
				<div className='flex items-center'>
					<span className='gray'>{this.props.index + 1}.</span>
					{userId && (
						<div
							style={{cursor: 'pointer'}}
							className='ml1 gray f11'
							onClick={() => this._voteForLink()}>
							▲
						</div>
					)}
				</div>
				<div className='ml1'>
					<div>{this.props.link.description} ({this.props.link.url})</div>
					<div className='f6 lh-copy gray'>{this.props.link.votes.length} votes | by {this.props.link.postedBy ? this.props.link.postedBy.name : 'Unknown'} {timeDifferenceForDate(this.props.link.createdAt)}</div>
				</div>
			</div>
		)
	}
	
	_voteForLink = async () => {
		const { createVoteMutation, updateStoreAfterVote } = this.props
		const { votes, id: linkId } = this.props.link
		
		const userId  = localStorage.getItem(GC_USER_ID)
		const isVoted = votes.find(({ user: { id }}) => id === userId)
		if (isVoted)
			return console.log(`User (${userId}) already voted for this link.`)
		
		await createVoteMutation({
			variables: { userId, linkId },
			update: (store, response) => {
				updateStoreAfterVote(store, response, linkId)
			}})
	}
}



export default graphql(CREATE_VOTE_MUTATION, {
	name: 'createVoteMutation'
})(Link)