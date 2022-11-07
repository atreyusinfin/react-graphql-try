const useEffect = require('react').useEffect
const Toast = (props) => {
    console.log('in', props)
    const {className, setClass, msg, type} = props
    useEffect( _ => {
        if (className === 'show') { setTimeout(_ => { setClass('') }, 3000) }
    })

    return (
        <div 
            className={className + ' ' + type}
            id="toast">{msg}</div>
    )
}

export {Toast}
