const oauth = require('../services/oauth').Oauth
const sdk = require('../services/githubSdk').sdk
const {useState, useEffect} = require('react')
const users = require('../models/users')
const RepoList = require('./repoList').RepoList

const List = ({session, setSession, changeView}) => {
    const [hasAccess, setAvailable] = useState('without')
    const [repos, setRepos] = useState([])
    const [waitingAuth, setWaitingAuth] = useState({})

    const show = async (r) => {
        console.log('graphQL', r)
        if (r.message && r.message === 'Bad credentials') {
            setAvailable('without')
            setSession({
                name: session.name,
                email: session.email,
                password: session.pass,
            }) 
        }

        if (
            r.data 
            && r.data.viewer 
        ) {
            // WTF! (I don't have an explanation for this, just was the only way I could solve)
            let clone = JSON.parse(JSON.stringify(r.data.viewer.repositories))
            delete clone.pageInfo
            clone = JSON.parse(JSON.stringify(clone.nodes))
            setRepos(clone)
        }
    }

    useEffect(() => {
        if (session.access_token) {
            setAvailable('has')
            sdk.configure(session)
            sdk.list().then(r => { show(r) })
        }
    },[])

    const saveAccess = (pull) => {
        session = {...session, ...pull}
        users.update(session)
        setAvailable('has')
        sdk.list().then(r => { show(r) })
    }

    const pullAccess = () => {
        oauth.step2(saveAccess)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const askAccess = () => {
        oauth
            .step1()
            .then(l => {
                setWaitingAuth(l)
                setAvailable('waiting')
            })
    }

    return (
        <div className="main">  	
            <input type="checkbox" id="chk" aria-hidden="true"/>
            <div className="signup">
                <form onSubmit={handleSubmit} id="signup">
                    <label htmlFor="chk" aria-hidden="true">Repositories</label>
                    {
                        !session.access_token && hasAccess === 'without'
                        ? <button
                            onClick={askAccess}
                            >Grant access</button>
                        : '' 
                    }

                    {
                        !session.access_token && hasAccess === 'waiting'
                        ? 
                            <ul>
                                <li 
                                    className="step1" >{waitingAuth.user_code}</li>
                                <li
                                    className="step1" >
                                    <a
                                        rel="noreferrer"
                                        href={waitingAuth.verification_uri}
                                        target="_blank"
                                        onClick={pullAccess}
                                    >Allow access</a>
                                </li>
                            </ul>
                        : '' 
                    }
                    {
                        session.access_token && hasAccess === 'has'
                        ? 
                            <RepoList 
                                list={repos}
                                updateList={setRepos}
                            />
                        : '' 
                    }

                </form>
            </div>

            <div className="login">
                <form onSubmit={handleSubmit} id="login">
                    <label htmlFor="chk" aria-hidden="true">Profile</label>
                    <ul>
                        <li><label 
                                htmlFor="uname"
                                className="profileAtt"
                            >Name:</label>
                        </li>
                        <li>
                            <span 
                                name="uname"
                            >{session.name}</span>
                        </li>
                        <li><label 
                                htmlFor="email"
                                className="profileAtt"
                            >Email:</label>
                        </li>
                        <li>
                            <span 
                                name="email"
                            >{session.email}</span>
                        </li>
                    </ul>
                </form>
            </div>
        </div>
    )
}

export {List}
