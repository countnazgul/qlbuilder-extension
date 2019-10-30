const qlikComm = require('./qlik-comm');
const dataPreview = require('./dataPreview');
const helpers = require('./helpers');

const process = {
    getConnections: async function ({ qDoc, message }) {
        let connections = await qlikComm.getDataConnections(qDoc)

        return {
            command: 'sendConnections',
            data: connections
        }
    },
    getFiles: async function ({ qDoc, message }) {
        let filesList = await qlikComm.getFilesList(qDoc, message.data.connectionId, message.data.path)
        // let dcProperties = await getDataConnectionProps(qDoc, message.connectionId)

        return {
            command: 'sendFiles',
            connectionId: message.connectionId,
            data: filesList
        }
    },
    getAdditionalTable: async function({ qDoc, message }) {
        // fileType.combinedType = 'single'
        return await dataPreview.singleTable({ message, fileType, qDoc })
    },
    getDataPreview: async function ({ qDoc, message }) {
        let fileType = {}

        if (message.data.options) {
            fileType = message.data.options
        } else {
            fileType = await qDoc.guessFileType(message.data.connectionId, message.data.path)
        }


        if (helpers.defineFileType(fileType.qType) == 'single') {
            fileType.combinedType = 'single'
            return await dataPreview.singleTable({ message, fileType, qDoc })
        }

        if (helpers.defineFileType(fileType.qType) == 'excel') {
            fileType.combinedType = 'excel'
            return await dataPreview.excel({ message, fileType, qDoc })
        }

        if (helpers.defineFileType(fileType.qType) == 'xml') {
            fileType.combinedType = 'xml'
            return await dataPreview.xml({ message, fileType, qDoc })
        }

    },
    copyToClipboard: async function ({ qDoc, message, vscode }) {
        await vscode.env.clipboard.writeText(message.data.loadScript)
        return true
    }
}

module.exports = process

