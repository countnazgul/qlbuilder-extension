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
        // currentTable = message.data.currentTable
        // fileTablePreview = message.data.fileTables
    } else {
        // fileTables = await qDoc.getFileTables(message.data.connectionId, message.data.path, { qType: fileType.qType })
        // currentTable = fileTables[0].qName
    }

    let fileTablePreview = await qDoc.getFileTablePreview(message.data.connectionId, message.data.path, fileType, currentTable)
    
    // let fileTablesAndFields = await getAllTablesAndFields({qDoc, message, fileType, fileTables})
    // let allLoadScripts = buildCompleteScript(message.data, fileTablesAndFields)
    // let fileTableAndFields = await qDoc.getFileTableFields(message.data.connectionId, message.data.path, fileType, currentTable)
    // let loadScript = helpers.createLoadScript(message.data, fileTableAndFields)

    let command = 'sendDataPreviewExcel'

    return {
        command: command,
        data: {
            dataPreview: fileTablePreview,
            fileType: fileType,
            fileTables: fileTables,
            currentTable: currentTable,
            // loadScript: allLoadScripts
        }
    }
}

const xml = async function ({ message, fileType, qDoc }) {
    let currentTable = ''
    let fileTables = []

    
    if (message.data.currentTable) {
        currentTable = message.data.currentTable
        // fileTablePreview = message.data.fileTables
    } else {
        fileTables = await qDoc.getFileTablesEx(message.data.connectionId, message.data.path, { qType: fileType.qType })
        currentTable = fileTables[0].qName
    }

    let fileTablePreview = await qDoc.getFileTablePreview(message.data.connectionId, message.data.path, fileType, currentTable)
    let fileTableAndFields = await qDoc.getFileTableFields(message.data.connectionId, message.data.path, fileType, currentTable)
    let loadScript = helpers.createLoadScript(message.data, fileTableAndFields)

    return {
        command: 'sendDataPreviewExcel',
        data: {
            dataPreview: fileTablePreview,
            fileType: fileType,
            fileTables: fileTables,
            currentTable: currentTable,
            loadScript: loadScript
        }
    }
}

//json, kml
const webFiles = async function () {

}





module.exports = {
    singleTable,
    excel,
    xml,
    webFiles
}