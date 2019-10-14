const path = require('path');

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

const scriptUriBuilder = function scriptUri_builder(vscode, extPath, mediaPath, scriptFile) {
    // Local path to main script run in the webview
    const scriptPathOnDisk = vscode.Uri.file(
        path.join(extPath, mediaPath, scriptFile)
    );

    // And the uri we use to load this script in the webview
    const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });

    return scriptUri;
}

const getWebviewContent = function (vscode, extPath) {
    const webview_uri = scriptUriBuilder(vscode, extPath, 'src/webview', 'scripts.js');
    const styles_uri = scriptUriBuilder(vscode, extPath, 'src/webview', 'styles.css');
    const jquery_uri = scriptUriBuilder(vscode, extPath, 'src/resources/js', 'jquery.min.js');

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

const createWebViewPanel = function ({ vscode, context, identity, title }) {
    return vscode.window.createWebviewPanel(
        identity, // Identifies the type of the webview. Used internally
        title, // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
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
            path.join(context.extensionPath, 'src', 'resources', 'Sense_Logo.png')
        ),
        dark: vscode.Uri.file(
            path.join(context.extensionPath, 'src', 'resources', 'Sense_Logo_Gray.svg')
        )
    }
}

module.exports = {
    compare,
    // getNonce,
    // scriptUriBuilder,
    createLoadScript,
    getWebviewContent,
    createWebViewPanel,
    panelIcons
}