const conf = require('../config.js').conf
const clientId = conf.clientId
const Oauth = ((clientId) => {
    let login = {}
    let nIntervalId

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    return {
        step1 : async () => {
            // ask some access
            const url = 'http://localhost:4000/https://github.com/login/device/code'
            const resp = await fetch(
                url,
                {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        client_id: clientId,
                        scope: 'repo read:packages read:org read:public_key read:repo_hook user read:discussion read:enterprise read:gpg_key'
                    })
                }
            )

            login = await resp.json()
            return login
        },
        step2 : async (callback) => {
            if (!nIntervalId) {
                nIntervalId = setInterval( async _=> {
                    const url = 'http://localhost:4000/https://github.com/login/oauth/access_token'
                    const resp = await fetch(
                        url,
                        {
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify({
                                client_id: clientId,
                                device_code: login.device_code,
                                grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
                            })
                        }
                    )

                    const pull = await resp.json()
                    if (pull.access_token) {
                        callback(pull)
                        window.clearInterval(nIntervalId)
                        nIntervalId = null
                    }
                }, ((login.interval + 1) * 1000))
            }
        },
    }
})(clientId)

export {Oauth}
