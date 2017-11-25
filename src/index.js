import React from 'react'
import ReactDOM from 'react-dom'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient }   from 'apollo-client'
import { HttpLink }       from 'apollo-link-http'
import { InMemoryCache }  from 'apollo-cache-inmemory'
import { BrowserRouter }  from 'react-router-dom'
import { ApolloLink }     from 'apollo-client-preset'

import './styles/index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import { GC_AUTH_TOKEN } from './constants'

const middlewareAuthLink = new ApolloLink((operation, forward) => {
	const token = localStorage.getItem(GC_AUTH_TOKEN)
	const authorizationHeader = token ? `Bearer ${token}` : null
	operation.setContext({
		headers: {
			authorization: authorizationHeader
		}
	})
	return forward(operation)
})

const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjafoodcy04sr0175b256e1oe' })
const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)

const client = new ApolloClient({
	link: httpLinkWithAuthToken,
	cache: new InMemoryCache()
})


ReactDOM.render(
	<BrowserRouter>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</BrowserRouter>, document.getElementById('root')
)

registerServiceWorker()
