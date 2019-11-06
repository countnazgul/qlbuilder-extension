const vscode = require('vscode');
const qAuth = require('qlik-sense-authenticate');

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
        let selectedEnvironmentDetails = filesChecks.message.coreConfig.filter(function (e) {
            return e.name == selectedEnvironment
        })[0]

        if (!selectedEnvironment) {
            return false
        }

        let environmentChecks = helpers.environmentChecks.combined(selectedEnvironment, filesChecks.message)

        let test = initialChecks.combined(selectedEnvironment)

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

        let envVariables = getEnvVariables(selectedEnvironment)
        if (envVariables.error) return envVariables

        let qsEnt = await qlikComm.handleAuthenticationType[selectedEnvironmentDetails.authentication.type]({ selectedEnvironmentDetails, envVariables.message })
        let qDoc = await qlikComm.getQlikDoc(environmentChecks.message)

        if (qDoc.error) {
            vscode.window.showErrorMessage(qDoc.message)
            panel.dispose()
            return false
        }

        panel.postMessage({
            command: 'docOpen'
        })

        panel.webview.onDidReceiveMessage(async function (message) {
            // let result = await processMessage(message)
            let result = await processMessage[message.command]({ qDoc: qDoc.message, message, vscode })
            panel.webview.postMessage(result)
        })

        return 1
    })
}

const getEnvVariables = function (envName) {

}

module.exports = dataConnections