const path = require('path');
const fs = require('fs');
const config = require('./config');
const yaml = require('js-yaml');
const homeDir = require('os').homedir();

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

const createLoadScript = function (connection, fileTableFields) {
    let loadScript = ['Load']

    let fields = []
    for (let field of fileTableFields.qFields) {
        fields.push(`\t"${field.qName}"`)
    }

    loadScript.push(fields.join(`,\n`))
    loadScript.push(`FROM [lib://${connection.connection.label}/${connection.path}]`)

    loadScript.push(`${fileTableFields.qFormatSpec};`)

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

const configChecks = {
    config: function (vscode) {
        let folder = vscode.workspace.workspaceFolders

        if (!folder) return { error: true, message: 'Please, open project folder first' }
        if (folder.length > 1) return { error: true, message: 'Too many folders are open' }

        let configPath = `${folder[0].uri.fsPath}\\config.yml`

        if (!fs.existsSync(configPath)) return { error: true, message: 'config.yml is not present in the current folder' }

        let configContent = yaml.safeLoad(fs.readFileSync(configPath).toString())


        return { error: false, message: configContent }
    },
    homeConfig: function () {
        let qlConfigLocation = `${homeDir}\\.qlbuilder.yml`

        if (!fs.existsSync(qlConfigLocation)) return { error: true, message: `Unable to find .qlbuilder.yml in ${homeDir}` }

        let qlConfig = yaml.safeLoad(fs.readFileSync(qlConfigLocation).toString())

        return { error: false, message: qlConfig }
    },
    combined: function (vscode) {
        let configOK = this.config(vscode)
        if (configOK.error) return configOK

        let homeConfig = this.homeConfig()
        if (homeConfig.error) return homeConfig

        return {
            error: false,
            message: {
                coreConfig: configOK.message,
                homeConfig: homeConfig.message
            }
        }
    }
}

const environmentChecks = {
    // core: function (selectedEnvironment, config) {
    //     let environment = config.filter(function (e) {
    //         return e.name == selectedEnvironment
    //     })

    //     if (environment.length == 0) return { error: true, message: 'The specified environment name do not exists in config.yml' }

    //     return { error: false, message: environment[0] }

    // },
    home: function (selectedEnvironment, config, coreEnv) {
        if (coreEnv.host.indexOf(':4848')) return { error: false, message: 'QS Desktop' }
        if (!config.homeConfig[selectedEnvironment]) return { error: true, message: 'The selected environment was not found in the home config .qlbuilder file' }

        return config.homeConfig[selectedEnvironment]
    },
    combined: function (selectedEnvironment, config) {
        let coreEnv = config.coreConfig.filter(function (e) {
            return e.name == selectedEnvironment
        })

        let homeCheck = this.home(selectedEnvironment, config, coreEnv[0])
        if (homeCheck.error) return homeCheck

        return {
            error: false,
            message: {
                core: coreEnv[0],
                home: homeCheck.home
            }
        }
    }
}

const defineFileType = function (qType) {
    let singleTableFiles = ['CSV', 'QVD', 'QVX']
    let excelFiles = ['EXCEL_BIFF', 'EXCEL_OOXML']
    let xml = ['XML', 'KML']
    let webFiles = ['JSON', 'HTML']

    if (singleTableFiles.indexOf(qType) > -1) return 'single'
    if (excelFiles.indexOf(qType) > -1) return 'excel'
    if (xml.indexOf(qType) > -1) return 'xml'
    if (webFiles.indexOf(qType) > -1) return 'web'

    return 'undefined'
}

module.exports = {
    configChecks,
    environmentChecks,
    compare,
    createLoadScript,
    getWebviewContent,
    createWebViewPanel,
    panelIcons,
    defineFileType
}