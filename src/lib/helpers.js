const path = require('path');
const fs = require('fs');

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

// TODO: it doesn't look nice. Possible to be prettier?
const getWebviewContent = function (vscode, context, panel) {
    const nonce = getNonce();

    const webview_uri = scriptUriBuilder(vscode, panel, context.extensionPath, 'src/webview', 'scripts.js');
    const styles_uri = scriptUriBuilder(vscode, panel, context.extensionPath, 'src/webview', 'styles.css');
    const jquery_uri = scriptUriBuilder(vscode, panel, context.extensionPath, 'src/resources/js', 'jquery.min.js');

    const leonardo_js = scriptUriBuilder(vscode, panel, context.extensionPath, 'src/resources/js', 'leonardo-ui.min.js');
    const leonardo_css = scriptUriBuilder(vscode, panel, context.extensionPath, 'src/resources/css', 'leonardo-ui.min.css');

    const lui_woff = scriptUriBuilder(vscode, panel, context.extensionPath, 'src/resources/fonts', 'lui-icons.woff');
    const lui_ttf = scriptUriBuilder(vscode, panel, context.extensionPath, 'src/resources/fonts', 'lui-icons.ttf');
    const hack_ttf = scriptUriBuilder(vscode, panel, context.extensionPath, 'src/resources/fonts', 'Hack-Regular.ttf');

    const csp = [
        `default-src 'nonce-${nonce}'`,
        `img-src vscode-resource:`,
        `script-src 'nonce-${nonce}'`,
        `style-src vscode-resource: 'nonce-${nonce}'`,
        `font-src vscode-resource: 'nonce-${nonce}'`
    ]

    const filePath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview', 'index.html'));
    let htmlInitial = fs.readFileSync(filePath.fsPath, 'utf8').toString();

    htmlInitial = htmlInitial.replace(/{nonce}/g, nonce);
    htmlInitial = htmlInitial.replace(/{webview_uri}/g, webview_uri);
    htmlInitial = htmlInitial.replace(/{styles_uri}/g, styles_uri);
    htmlInitial = htmlInitial.replace(/{jquery_uri}/g, jquery_uri);
    htmlInitial = htmlInitial.replace(/{leonardo_js}/g, leonardo_js);
    htmlInitial = htmlInitial.replace(/{leonardo_css}/g, leonardo_css);
    htmlInitial = htmlInitial.replace(/{lui_woff}/g, lui_woff);
    htmlInitial = htmlInitial.replace(/{lui_ttf}/g, lui_ttf);
    htmlInitial = htmlInitial.replace(/{hack_ttf}/g, hack_ttf);
    htmlInitial = htmlInitial.replace(/{csp}/g, csp.join(';'));

    return htmlInitial
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
            path.join(context.extensionPath, 'src', 'resources/images', 'Sense_Logo.png')
        ),
        dark: vscode.Uri.file(
            path.join(context.extensionPath, 'src', 'resources/images', 'Sense_Logo_Gray.svg')
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