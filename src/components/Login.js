import React, { Component } from 'react'
// import { GC_USER_TO_ID, GC_AUTH_TOKEN } from '../constants'

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

		console.log('submitting')
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

export default Login