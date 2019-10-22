const helpers = require('./helpers');
// csv, txt, qvd, qvx
const singleTable = async function ({ message, fileType, qDoc }) {

    let fileTablePreview = await qDoc.getFileTablePreview(message.data.connectionId, message.data.path, fileType, '')
    let fileTableAndFields = await qDoc.getFileTableFields(message.data.connectionId, message.data.path, fileType, '')

    let loadScript = helpers.createLoadScript(message.data, fileTableAndFields)

    return {
        command: 'sendDataPreviewSingleTable',
        data: {
            dataPreview: fileTablePreview,
            fileType: fileType,
            loadScript: loadScript
        }
    }
}

// xls, xlsx
const excel = async function ({ message, fileType, qDoc }) {
    let currentTable = ''
    let fileTables = []

    if (message.data.currentTable) {
        currentTable = message.data.currentTable
        // fileTablePreview = message.data.fileTables
    } else {
        fileTables = await qDoc.getFileTables(message.data.connectionId, message.data.path, { qType: fileType.qType })
        currentTable = fileTables[0].qName
    }

    let fileTablePreview = await qDoc.getFileTablePreview(message.data.connectionId, message.data.path, fileType, currentTable)

    return {
        command: 'sendDataPreviewExcel',
        data: {
            dataPreview: fileTablePreview,
            fileType: fileType,
            fileTables: fileTables,
            currentTable: currentTable
        }
    }
}

// xml, json, kml
const webFiles = async function () {

}


module.exports = {
    singleTable,
    excel,
    webFiles
}