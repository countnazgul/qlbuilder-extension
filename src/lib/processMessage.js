const qlikComm = require('./qlik-comm');
const dataPreview = require('./dataPreview');
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
    getDataPreview: async function (qDoc, message) {
        let fileType = {}

        if (message.data.options) {
            fileType = message.data.options
        } else {
            fileType = await qDoc.guessFileType(message.data.connectionId, message.data.path)
        }


        if (helpers.defineFileType(fileType.qType) == 'single') return await dataPreview.singleTable({ message, fileType, qDoc })

        if (helpers.defineFileType(fileType.qType) == 'excel') return await dataPreview.excel({ message, fileType, qDoc })

    }
}

module.exports = process