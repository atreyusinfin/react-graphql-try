const sdk = (() => {
    const url = 'http://localhost:4000/https://api.github.com/graphql'
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    return {
        configure: (session) => {
            headers['Authorization'] = `Bearer ${session.access_token}`
        },
        list: async () => {
            const body = JSON.stringify({
                query : 
`
{
  viewer {
    repositories(
        first: 100, 
        orderBy: {field:NAME, direction:ASC},
        affiliations: [OWNER, ORGANIZATION_MEMBER, COLLABORATOR],
        ownerAffiliations: [OWNER, ORGANIZATION_MEMBER, COLLABORATOR]
      ) {
      pageInfo {hasNextPage, endCursor}
      nodes {
        name
        url
        isPrivate
        owner {
          login
        }
        defaultBranchRef {
          name
        }
      }
    }
  }
}
`

            })
            const resp = await fetch(
                    url,
                    {
                        method:'POST',
                        headers: headers,
                        body: body
                    }
                )

            return await resp.json()
        }
    }
})()

export {sdk}
