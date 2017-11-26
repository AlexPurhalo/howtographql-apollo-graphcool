import React, { Component } from "react"
import { graphql }          from 'react-apollo'

import { GC_USER_ID, LINKS_PER_PAGE }            from '../constants'
import { CREATE_LINK_MUTATION, ALL_LINKS_QUERY } from '../queries'

class CreateLink extends Component {
	state = {
		description: '',
		url: ''
	}
	
	handleChangeField = ({ name, value }) =>
		this.setState({ [`${name}`]: value })
	
	handleSubmitForm = (e) => {
		e.preventDefault()
		
		const {
			state: { description, url },
			props: { createLinkMutation }
		} = this
		
		const postedById = localStorage.getItem(GC_USER_ID)
		
		if (!postedById) return console.error('No user logged in')
		
		const createLink = async () => {
			await createLinkMutation({
				variables: {
					description,
					url,
					postedById
				},
				update: (store, { data: { createLink: allLinks } }) => {
					const first   = LINKS_PER_PAGE
					const skip    = 0
					const orderBy = 'createdAt_DESC'
					
					const storeData = store.readQuery({
						query: ALL_LINKS_QUERY,
						variables: { first, skip, orderBy }
					})
					
					store.writeQuery({
						query: ALL_LINKS_QUERY,
						data: { ...storeData, allLinks },
						variables: { first, skip, orderBy }
					})
				}
			})
			
			this.props.history.push(`/`)
		}
		
		return createLink()
	}
	
	render() {
		const {
			state: { description, url },
			handleChangeField,
			handleSubmitForm
		} = this
		
		return (
			<div>
				<form className="flex flex-column mt3" onSubmit={e => handleSubmitForm(e)}>
					<input {...{
						type:        'text',
						className:   'mb2',
						name:        'description',
						placeholder: 'A description for the link',
						
						value:    description,
						onChange: (e => handleChangeField(e.target))
					}} />
					
					<input {...{
						type:        'text',
						className:   'mb2',
						name:        'url',
						placeholder: 'The URL for the link',
						
						value:    url,
						onChange: (e => handleChangeField(e.target))
					}} />
					
					<button>Submit</button>
				</form>
			</div>
		)
	}
}



export default graphql(CREATE_LINK_MUTATION, { name: 'createLinkMutation' })(CreateLink)
