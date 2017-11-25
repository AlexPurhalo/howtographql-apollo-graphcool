import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Link from './Link'

class LinkList extends Component {
	render() {
		const { loading, error, allLinks: linksToRender } = this.props.allLinksQuery
		
		if (loading) return <div>...loading</div>
		if (error) return <div>server error</div>
		
		return (
			<div>
				{linksToRender.map(link =>
					<Link key={link.id} link={link} />
				)}
			</div>
		)
	}
}

const ALL_LINKS_QUERY = gql`
  query AllLinksQuery {
    allLinks {
      id
      createdAt
      url
      description
    }
  }
`


export default graphql(ALL_LINKS_QUERY, { name: 'allLinksQuery' })(LinkList)