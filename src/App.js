const {Form} = require('./Components/login')
const {List} = require('./Components/list')
const {useState} = require('react')
const App = () => {
    const [session, setSession] = useState({})
    const [view, setView] = useState('list')

    const loginResult = (_in) => {
        setSession(_in)
    }

    const changeView = (newView) => {
        setView(newView)
    }

    return (
        <div>
            {!session.email 
                ? <Form 
                    loginResult={loginResult}
                    />
                : ''
            }
            {session.email && view === 'list'
                ? <List
                    session={session}
                    setSession={setSession}
                    changeView={changeView}
                    />
                : ''
            }
        </div>
    )
}

export {App}
