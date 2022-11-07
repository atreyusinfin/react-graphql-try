const RepoList = ({list, updateList}) => {
    // set it like prop
    list = list.map(v => {
        if (!v.like) { v.like = false }
        return v
    })

    const pin = (k) => {
        const sortCriteria = (a, b) => {
            if (a.like && !b.like) { return -1 }
            if (!a.like && b.like) { return 1 }
            if (a.like === b.like) { return 0 }
        }
        list[k].like = !list[k].like
        updateList(list.sort(sortCriteria))
    }

    const runRepos = (repos) => {
        return repos.map((v, k) => {
            const name = v.owner.login + '/' + v.name
            return (
                <li 
                    key={v.owner.login + '_' + k}
                    className="t-row">
                    <div className="t-cell">
                        <div
                            className="split-left" >
                            <a 
                                href={v.url} 
                                target="_blank" 
                                title={name}
                                rel="noreferrer"> 
                                {name.slice(0,30) + (name.length > 30 ? '...' : '')} 
                            </a>
                        </div>
                        <div
                            className="split-rigth">
                            <span
                                title={!v.isPrivate ? 'public' : 'private'}>
                                {!v.isPrivate ? '🔓' : '🔒'}
                                <span
                                    className="like"
                                    onClick={ _ => {pin(k)}}>
                                    {v.like ? '⭐' : '★'}
                                </span>
                            </span>
                        </div>
                    </div>
                </li>
            )
        })
    }

    return (
        <nav className="overflow-v">
            <ul className="t-table">
                {runRepos(list)}
            </ul>
        </nav>
    )
}

export {RepoList}
