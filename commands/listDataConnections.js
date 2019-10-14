const vscode = require('vscode');
const enigma = require('enigma.js');
const WebSocket = require('ws');
const schema = require('enigma.js/schemas/12.20.0.json');
const path = require('path');

const dataConnections = async function (context) {
    vscode.commands.registerCommand('listDataConnections', async function () {

        const panel = vscode.window.createWebviewPanel(
            'DataConnections', // Identifies the type of the webview. Used internally
            'Qlik - Data Connections', // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath, 'lib')),
                    vscode.Uri.file(path.join(context.extensionPath, 'resources'))
                ],
            }
        );

        panel.webview.html = getWebviewContent(context.extensionPath)
        panel.iconPath = {
            light: vscode.Uri.file(
                path.join(context.extensionPath, 'resources', 'Sense_Logo.png')
            ),
            dark: vscode.Uri.file(
                path.join(context.extensionPath, 'resources', 'Sense_Logo_Gray.svg')
            )
        }

        let qDoc = await getQlikDoc()
        panel.postMessage({
            command: 'docOpen'
        })

        panel.webview.onDidReceiveMessage(async function (message) {
            switch (message.command) {
                case 'getConnections':
                    let connections = await getDataConnections(qDoc)
                    panel.webview.postMessage({
                        command: 'sendConnections',
                        text: connections
                    });
                    return
                case 'getFiles':
                    let filesList = await getFilesList(qDoc, message.connectionId, message.path)
                    // let dcProperties = await getDataConnProps(qDoc, message.connectionId)
                    panel.webview.postMessage({
                        command: 'sendFiles',
                        connectionId: message.connectionId,
                        text: filesList
                    });
                    return
                case 'getFileDataPreview':
                    let a1 = 1
                    let fileType = await qDoc.guessFileType(message.connectionId, message.path)
                    // let fileTableAndFields = await qDoc.getFileTableFields(message.connectionId, message.path, fileType, '')
                    let fileTablePreview = await qDoc.getFileTablePreview(message.connectionId, message.path, fileType, '')

                    panel.webview.postMessage({
                        command: 'fileDataPreview',
                        connectionId: message.connectionId,
                        text: fileTablePreview
                    });


                    let a = 1
                    return
            }
        })

        return 1
    })
}

function compare(a, b) {
    if (a.qFileSize < b.qFileSize) {
        return -1;
    }
    if (a.qFileSize > b.qFileSize) {
        return 1;
    }
    return 0;
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function scriptUri_builder(extPath, mediaPath, scriptFile) {
    // Local path to main script run in the webview
    const scriptPathOnDisk = vscode.Uri.file(
        path.join(extPath, mediaPath, scriptFile)
    );

    // And the uri we use to load this script in the webview
    const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });

    return scriptUri;
}

function getWebviewContent(extPath) {
    const webview_uri = scriptUri_builder(extPath, 'lib', 'webview.js');
    const styles_uri = scriptUri_builder(extPath, 'lib', 'webview.css');
    const jquery_uri = scriptUri_builder(extPath, 'resources', 'jquery.min.js');

    const nonce = getNonce();

    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" 
			content="default-src 'nonce-${nonce}'; img-src vscode-resource: https:; script-src 'nonce-${nonce}'; style-src vscode-resource: 'nonce-${nonce}'; ">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Data Connections</title>      
      <link nonce="${nonce}" rel="stylesheet" type="text/css" href="${styles_uri}">
  </head>
  <body>
    <div id="loading" >Connecting and opening the app ...</div>
    <div id="connections">test</div>
    <div id="filesListUP">UP</div>
    <div id="filesList"></div>
      
      
    <script nonce="${nonce}" src="${jquery_uri}"></script>
    <script nonce="${nonce}" src="${webview_uri}"></script>
  </body>
  </html>`;
}

async function getDataConnections(qDoc) {
    let connections = await qDoc.getConnections()

    return connections.map(function (c) {
        return { label: c.qName, description: c.qType, qId: c.qId, connectionString: c.qConnectionString }
    })
}

async function getFilesList(qDoc, connectionId, path) {
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

async function getQlikDoc() {
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

async function getDataConnProps(qDoc, connectionId) {
    let dcProps = await qDoc.getDataConnection(connectionId)

    return dcProps
}


module.exports = dataConnections