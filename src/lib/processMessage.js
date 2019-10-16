const qlikComm = require('./qlik-comm');
const helpers = require('./helpers');

const process = {
    getConnections: async function (qDoc, message) {
        let connections = await qlikComm.getDataConnections(qDoc)

        return {
            command: 'sendConnections',
            text: connections
        }
    },
    getFiles: async function (qDoc, message) {
        let filesList = await qlikComm.getFilesList(qDoc, message.data.connectionId, message.data.path)
        // let dcProperties = await getDataConnectionProps(qDoc, message.connectionId)

        return {
            command: 'sendFiles',
            connectionId: message.connectionId,
            text: filesList
        }
    },
    getFileDataPreview: async function (qDoc, message) {
        let a1 = 1
        let fileType = await qDoc.guessFileType(message.connectionId, message.path)
        // let fileTableAndFields = await qDoc.getFileTableFields(message.connectionId, message.path, fileType, '')
        let fileTablePreview = await qDoc.getFileTablePreview(message.connectionId, message.path, fileType, '')
        let loadScript = helpers.createLoadScript(fileTablePreview)

        return {
            command: 'fileDataPreview',
            connectionId: message.connectionId,
            text: fileTablePreview
        }
    }
}

module.exports = process