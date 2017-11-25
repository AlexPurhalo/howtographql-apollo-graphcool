import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql                  from 'graphql-tag'

import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants'

class Login extends Component {
	
	state = {
		login: true,
		email: '',
		password: '',
		name: ''
	}
	
	handleChangeField = ({ name, value }) =>
		this.setState({ [`${name}`]: value })
	
	handleSubmitForm = (e) => {
		e.preventDefault()
		
		const saveUserData = (id, token) => {
			localStorage.setItem(GC_USER_ID, id)
			localStorage.setItem(GC_AUTH_TOKEN, token)
		}
		
		const confirm = async () => {
			const { login, name, email, password }                 = this.state
			const { authenticateUserMutation, signupUserMutation } = this.props
			const variables = { email, name, password }
			
			if (login) {
				const result = await authenticateUserMutation({ variables })
				saveUserData('x', result.data.authenticateUser.id)
				
			} else {
				const result = await signupUserMutation({ variables })
				const { id, token } = result.data.signupUser
				
				saveUserData(id, token)
			}
			
			this.props.history.push(`/`)
		}
		
		return confirm()
	}
	
	handleSwitchLogin = () =>
		this.setState({ login: !this.state.login })
	
	render() {
		const {
			state: { login, email, password, name },
			handleChangeField, handleSubmitForm, handleSwitchLogin
		} = this
		
		return (
				<form onSubmit={e => handleSubmitForm(e)}>
				<h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
				
				<div className="flex flex-column">
					{!login && (
						<input {...{
							type:        'text',
							name:        'name',
							placeholder: 'Your name',
							value:        name,
							onChange:     (e => handleChangeField(e.target))
						}} />
					)}
					<input {...{
						type:        'email',
						name:        'email',
						placeholder: 'Your email',
						value:       email,
						onChange:    (e => handleChangeField(e.target))
					}} />
					<input {...{
						type:        'password',
						name:        'password',
						placeholder:  login ? 'Your password' : 'Choose a safe password',
						value:        password,
						onChange:     (e => handleChangeField(e.target))
					}} />
				</div>
				
				<div className="flex mt3">
					<button className="pointer mr2 button" type="submit">
						{login ? 'Login' : 'create account'}
					</button>
					<button className="pointer button" type="reset" onClick={() => handleSwitchLogin()}>
						{login ? 'need to create an account?' : 'already have account'}
					</button>
				</div>
			</form>
		)
	}
}

const SIGNUP_USER_MUTATION = gql`
  mutation SignupUserMutation($email: String!, $password: String!, $name: String!) {
    signupUser(
      email: $email,
      password: $password,
      name: $name
    ) {
      id
      token
    }
  }
`

const AUTHENTICATE_USER_MUTATION = gql`
  mutation AuthenticateUserMutation($email: String!, $password: String!) {
    authenticateUser(
      email: $email,
      password: $password
    ) {
      token
    }
  }
`

export default compose(
	graphql(SIGNUP_USER_MUTATION, { name: 'signupUserMutation' }),
	graphql(AUTHENTICATE_USER_MUTATION, { name: 'authenticateUserMutation' })
)(Login)