const enigma = require('enigma.js');
const WebSocket = require('ws');
const schema = require('enigma.js/schemas/12.20.0.json');

const getQlikDoc = async function () {
    const session = enigma.create({
        schema,
        url: `ws://localhost:4848/app/engineData/identity/${+new Date()}`,
        createSocket: url => new WebSocket(url),
    });

    let global = await session.open()
    let docs = await global.getDocList()

    let doc = await global.openDoc(docs[1].qDocId)

    return doc
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