const path = require('path');
const fs = require('fs');
const config = require('./config')

const compare = function (a, b) {
    if (a.qFileSize < b.qFileSize) {
        return -1;
    }
    if (a.qFileSize > b.qFileSize) {
        return 1;
    }
    return 0;
}

const getNonce = function () {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const createLoadScript = function (message) {
    let loadScript = ['Load']

    let fields = message.qPreview[0].join(',\n')

    loadScript.push(fields)
    loadScript.push('From')
    return loadScript.join('\n')
}

const scriptUriBuilder = function scriptUri_builder(vscode, panel, extPath, mediaPath, scriptFile) {
    // Local path to main script run in the webview
    const scriptPathOnDisk = vscode.Uri.file(
        path.join(extPath, mediaPath, scriptFile)
    );

    // And the uri we use to load this script in the webview
    // const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
    const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);

    return scriptUri;
}


const getWebviewContent = function (vscode, context, panel) {
    const nonce = getNonce();

    const filePath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview', 'index.html'));
    let htmlInitial = fs.readFileSync(filePath.fsPath, 'utf8').toString();

    htmlInitial = htmlInitial.replace(/{nonce}/g, nonce);
    htmlInitial = htmlInitial.replace(/{csp}/g, config.csp(nonce));

    for (let res of config.webResources) {
        let replaceTo = scriptUriBuilder(vscode, panel, context.extensionPath, res.folder, res.file)

        let replaceWhat = new RegExp(`{${res.name}}`, 'g');
        htmlInitial = htmlInitial.replace(replaceWhat, replaceTo);
    }

    return htmlInitial
}

const createWebViewPanel = function ({ vscode, context, identity, title }) {
    return vscode.window.createWebviewPanel(
        identity,
        title,
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(context.extensionPath, 'src', 'lib')),
                vscode.Uri.file(path.join(context.extensionPath, 'src', 'resources')),
                vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview'))
            ],
        }
    );
}

const panelIcons = function (vscode, context) {
    return {
        light: vscode.Uri.file(
            path.join(context.extensionPath, 'src', 'resources/images', 'Sense_Logo.png')
        ),
        dark: vscode.Uri.file(
            path.join(context.extensionPath, 'src', 'resources/images', 'Sense_Logo_Gray.svg')
        )
    }
}

const initialChecks = {
    config: function (vscode) {
        let folder = vscode.workspace.workspaceFolders

        if (folder.length > 1) return { error: true, message: 'Too many folders are open' }

        let configPath = `${folder[0].uri.fsPath}\\config.yml`

        if (!fs.existsSync(configPath)) return { error: true, message: 'config.yml is not present in the current folder' }

        let configContent = fs.readFileSync(configPath).toString()

        return { error: false, message: configContent }
    },
    homeConfig: function () {

    },
    combined: function (vscode) {
        let configOK = this.config(vscode)

        if (configOK.error) return configOK

        return configOK
    }
}

module.exports = {
    initialChecks,
    compare,
    // getNonce,
    // scriptUriBuilder,
    createLoadScript,
    getWebviewContent,
    createWebViewPanel,
    panelIcons
}