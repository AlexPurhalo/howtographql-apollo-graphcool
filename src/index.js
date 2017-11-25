import React from 'react'
import ReactDOM from 'react-dom'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient }   from 'apollo-client'
import { HttpLink }       from 'apollo-link-http'
import { InMemoryCache }  from 'apollo-cache-inmemory'
import { BrowserRouter }  from 'react-router-dom'

import './styles/index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjaegnye02bqh014085ya1kam' })

const client = new ApolloClient({
	link: httpLink,
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
