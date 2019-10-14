const vscode = require('vscode');

const helpers = require('../lib/helpers');
const processMessage = require('../lib/processMessage');
const qlikComm = require('../lib/qlik-comm');

const dataConnections = function (context) {
    return vscode.commands.registerCommand('listDataConnections', async function () {

        let panelConfig = {
            vscode: vscode,
            context: context,
            identity: 'DataConnections',
            title: 'Qlik - Data Connections'
        }
        let panel = helpers.createWebViewPanel(panelConfig)

        panel.webview.html = helpers.getWebviewContent(vscode, context.extensionPath)
        panel.iconPath = helpers.panelIcons(vscode, context)

        let qDoc = await qlikComm.getQlikDoc()

        panel.postMessage({
            command: 'docOpen'
        })

        panel.webview.onDidReceiveMessage(async function (message) {
            // let result = await processMessage(message)
            let result = await processMessage[message.command](qDoc, message)
            panel.webview.postMessage(result)
        })

        return 1
    })
}

module.exports = dataConnections