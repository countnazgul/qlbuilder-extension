const enigma = require('enigma.js');
const WebSocket = require('ws');
const schema = require('enigma.js/schemas/12.20.0.json');

const getQlikDoc = async function (config) {
    let wsUri = `ws://${config.core.host}`

    if (!config.core.secure == undefined) {
        wsUri = `ws://${config.core.host}`
    }

    if (config.core.secure) {
        wsUri = `wss://${config.core.host}`
    }

    wsUri += `/app/engineData/identity/${+new Date()}`

    const session = enigma.create({
        schema,
        url: wsUri,
        createSocket: url => new WebSocket(url),
    });

    try {
        let global = await session.open()
        // let docs = await global.getDocList()

        let doc = await global.openDoc(config.core.appId)

        return { error: false, message: doc }
    } catch (e) {
        return { error: true, message: e.message }
    }
}

const getDataConnectionProps = async function (qDoc, connectionId) {
    let dcProps = await qDoc.getDataConnection(connectionId)

    return dcProps
}

const getFilesList = async function (qDoc, connectionId, path) {
    let list = await qDoc.getFolderItemsForConnection(connectionId, path)

    let folders = list.filter(function (d) {
        return d.qType == 'FOLDER'
    })

    let files = list.filter(function (d) {
        return d.qType != 'FOLDER'
    })

    let sorted = folders.concat(files)

    return sorted
}

const getDataConnections = async function (qDoc) {
    let connections = await qDoc.getConnections()

    return connections.map(function (c) {
        return { label: c.qName, description: c.qType, qId: c.qId, connectionString: c.qConnectionString }
    })
}

const handleAuthenticationType = {
    desktop: async function () {
        return {}
    },
    cert: async function ({ environment, variables }) {

        if (variables.QLIK_USER.indexOf('\\') == -1) {
            return { error: true, message: 'The username should be in format DOMAIN\\USER' }
        }

        try {
            return {
                error: false,
                message: {
                    ca: [helpers.readCert(variables.QLIK_CERTS, 'root.pem')],
                    key: helpers.readCert(variables.QLIK_CERTS, 'client_key.pem'),
                    cert: helpers.readCert(variables.QLIK_CERTS, 'client.pem'),
                    headers: {
                        'X-Qlik-User': `UserDirectory=${encodeURIComponent(variables.QLIK_USER.split('\\')[0])}; UserId=${encodeURIComponent(variables.QLIK_USER.split('\\')[1])}`,
                    }
                }
            }
        } catch (e) {
            return { error: true, message: e.message }
        }
    },
    jwt: async function ({ environment, variables }) {
        return {
            error: false, message: {
                headers: { Authorization: `Bearer ${variables.QLIK_TOKEN}` },
            }
        }
    },
    winform: async function ({ environment, variables }) {

        let sessionHeaderName = 'X-Qlik-Session'
        if (environment.authentication.sessionHeaderName) {
            sessionHeaderName = environment.authentication.sessionHeaderName
        }

        if (variables.QLIK_USER.indexOf('\\') == -1) {
            return { error: true, message: 'The username should be in format DOMAIN\\USER' }
        }

        // decode the password only if the password is comming from .qlbuilder.yml
        // and encoding != false in the env config (the used dont want to use encoded password)
        if (variables.isHomeConfig && environment.authentication.encoding) {
            if (!isBase64(variables.QLIK_PASSWORD)) {
                return { error: true, message: 'Please do not store passwords in plain text! Use "qlbuilder encode" to get the encoded version of the password and update the yml entry' }
            }

            let decodedPassword = common.decode(variables.QLIK_PASSWORD)
            variables.QLIK_PASSWORD = decodedPassword.message
        }

        let auth_config = {
            type: 'win',
            props: {
                url: environment.host,
                proxy: '',
                username: variables.QLIK_USER,
                password: variables.QLIK_PASSWORD,
                header: sessionHeaderName
            }
        }

        let sessionId = await qAuth.login(auth_config)

        if (sessionId.error) {
            return sessionId
        }

        return {
            error: false,
            message: {
                headers: {
                    'Cookie': `${sessionHeaderName}=${sessionId.message}`,
                }
            }
        }
    }
}

module.exports = {
    getQlikDoc,
    getDataConnectionProps,
    getFilesList,
    getDataConnections,
    handleAuthenticationType
}