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
    getDataPreview: async function (qDoc, message) {
        let fileType = {}
        let fileTables = []

        if (message.data.options) {
            fileType = message.data.options
        } else {
            fileType = await qDoc.guessFileType(message.data.connectionId, message.data.path)
        }

        if (fileType.qType == 'EXCEL_OOXML') {
            fileTables = await qDoc.getFileTables(message.data.connectionId, message.data.path, { qType: 'EXCEL_OOXML' })
        }

        let fileTableAndFields = await qDoc.getFileTableFields(message.data.connectionId, message.data.path, fileType, '')
        let fileTablePreview = await qDoc.getFileTablePreview(message.data.connectionId, message.data.path, fileType, '')
        // let loadScript = helpers.createLoadScript(fileTablePreview)

        return {
            command: 'sendDataPreview',
            data: {
                dataPreview: fileTablePreview,
                fileType: fileType,
                fileTables: fileTables
            }
        }
    }
}

module.exports = process