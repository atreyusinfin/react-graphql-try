const {useState} = require('react')
const users = require('../models/users')
const isEmail = require('../helpers/validators').isEmail
const Toast =  require('../Components/toast').Toast

const Form = ({loginResult}) => {
    // errors
    const [errorName, setErrorName] = useState(false)
    const [errorEmail, setErrorEmail] = useState(false)
    const [errorPsw, setErrorPsw] = useState(false)

    // fields
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [toastClass, setToastClass] = useState('')
    const [toastMsg, setToastMsg] = useState('')
    const [toastType, setToastType] = useState('')

    const clearForm = () => {
        setUserName('')
        setEmail('')
        setPass('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!email || !pass) {
            if (!email) { setErrorEmail(true) }
            if (!pass) { setErrorPsw(true) }
            return
        }

        if (!isEmail(email)) {
            setErrorEmail(true)
            return
        }

        const event = e.currentTarget.id
        const user = {
            email: email,
            password: pass
        }

        if (event === 'signup') {
            if (!userName) { setErrorName(true); return }
            user.name= userName
            const resp = users.create(user)
            if (resp.ack === 'error') { 
                setToastType('error')
                setToastMsg(resp.msg)
                setToastClass('show')
                console.error('model error', resp)
                return
            }
            setToastType('error')
            setToastMsg(resp.msg)
            setToastClass('show')

            clearForm()
        }

        if (event === 'login') {
            const resp = users.login(user)
            if (resp.ack === 'error') { 
                setToastType('error')
                setToastMsg(resp.msg)
                setToastClass('show')
                console.error('model error', resp)
                return
            }
            loginResult(resp.user)
            clearForm()
        }
    }

    return (
        <div className="main">  	
            <input type="checkbox" id="chk" aria-hidden="true"/>
            <div className="signup">
                <form onSubmit={handleSubmit} id="signup">
                    <label htmlFor="chk" aria-hidden="true">Sign up</label>
                    <input 
                        type="text" 
                        name="txt" 
                        value={userName}
                        onChange={(e) => {setUserName(e.target.value); setErrorName(false)}}
                        className={errorName ? 'error' : ''}
                        placeholder="User name" 
                        required=""
                    />

                    <input 
                        type="email" 
                        name="email" 
                        value={email}
                        className={errorEmail ? 'error' : ''}
                        onChange={(e) => {setEmail(e.target.value); setErrorEmail(false)}}
                        placeholder="Email" 
                        required=""
                    />

                    <input 
                        type="password" 
                        name="pswd" 
                        value={pass}
                        className={errorPsw ? 'error' : ''}
                        onChange={(e) => {setPass(e.target.value); setErrorPsw(false)}}
                        placeholder="Password" 
                        required=""
                    />

                    <button>Sign up</button>
                </form>
            </div>

            <div className="login">
                <form onSubmit={handleSubmit} id="login">
                    <label htmlFor="chk" aria-hidden="true">Login</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={email}
                        onChange={(e) => {setEmail(e.target.value); setErrorEmail(false)}}
                        className={errorEmail ? 'error' : ''}
                        placeholder="Email" 
                        required=""
                    />
                    <input 
                        type="password" 
                        name="pswd" 
                        value={pass}
                        onChange={(e) => {setPass(e.target.value); setErrorPsw(false)}}
                        className={errorPsw ? 'error' : ''}
                        placeholder="Password" 
                        required=""
                    />
                    <button>Login</button>
                </form>
            </div>
{
                    toastClass === 'show'
                        ? (
                            <Toast
                                className={toastClass}
                                setClass={setToastClass}
                                msg={toastMsg}
                                type={toastType}
                            />
                            )
                        : ''
                }
        </div>
    );
}

export {Form}
