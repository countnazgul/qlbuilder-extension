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

module.exports = {
    getQlikDoc,
    getDataConnectionProps,
    getFilesList,
    getDataConnections
}