import React, { Component } from "react"
import { graphql }          from 'react-apollo'
import gql                  from 'graphql-tag'

import { GC_USER_ID } from '../constants'

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

const CREATE_LINK_MUTATION = gql`
  mutation CreateLinkMutation($description: String!, $url: String!, $postedById: ID!) {
    createLink(
      description: $description,
      url: $url,
      postedById: $postedById
    ) {
      id
      createdAt
      url
      description
      postedBy {
        id
        name
      }
    }
  }
`

export default graphql(CREATE_LINK_MUTATION, { name: 'createLinkMutation' })(CreateLink)
