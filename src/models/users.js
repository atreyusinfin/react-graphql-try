const users = (() =>{
    const getAll = _ => {
        const _all = JSON.parse(localStorage.getItem('users'))
        if (_all === null) { return [] }
        return _all
    }

    const setAll = (users) => { localStorage.setItem('users', JSON.stringify(users)) }

    const exists = (user) => {
        const found = getAll()
            .find(u => { return ( u.email === user.email) })
        return found === undefined
    }

    const insert = (user) => { 
        const all = getAll()
        all.push(user)
        setAll(all) 
    }
    
    const find = (key, val) => {
        return getAll().filter(u => u[key] === val) || []
    }

    return {
        create: (user) => {
            if (!exists(user)) { return {ack: 'error', msg: 'User Already exists'}}
            insert(user)
            return {ack: 'ok', msg: 'User has been created'}
        },
        find: (key, value) => {
            const found = getAll().find( u => { return u[key] === value })
            if (found === null) { return [] }
            return found
        },
        login: (user) => {
            const dbUser = find('email', user.email).find(u => u.password === user.password)
            if (!dbUser) {
                return {ack: 'error', msg: 'email or password incorrect'}
            }
            return {ack: 'ok', msg: 'access granted', user: dbUser}
        },
        update: (user) => {
            const users = getAll().map(u => { 
                if (u.email === user.email) { return user } 
                return u
            })
            console.log('users:', users)
            setAll(users) 
        }
    }
})()

module.exports = users
