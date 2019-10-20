const vscode = require('vscode');

const helpers = require('../lib/helpers');
const processMessage = require('../lib/processMessage');
const qlikComm = require('../lib/qlik-comm');

const dataConnections = function (context) {
    return vscode.commands.registerCommand('dataConnections', async function () {

        let filesChecks = helpers.configChecks.combined(vscode)

        if (filesChecks.error) {
            vscode.window.showErrorMessage(filesChecks.message)
            return false
        }

        let environmentNames = filesChecks.message.coreConfig.map(function (e) {
            return e.name
        })

        let selectedEnvironment = await vscode.window.showQuickPick(environmentNames)

        if (!selectedEnvironment) {
            return false
        }

        let environmentChecks = helpers.environmentChecks.combined(selectedEnvironment, filesChecks.message)

        if (environmentChecks.error) {
            vscode.window.showErrorMessage(environmentChecks.message)
            return false
        }

        let panelConfig = {
            vscode: vscode,
            context: context,
            identity: 'DataConnections',
            title: 'Qlik - Data Connections'
        }
        let panel = helpers.createWebViewPanel(panelConfig)

        panel.webview.html = helpers.getWebviewContent(vscode, context, panel)
        panel.iconPath = helpers.panelIcons(vscode, context)

        let qDoc = await qlikComm.getQlikDoc(environmentChecks.message)

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