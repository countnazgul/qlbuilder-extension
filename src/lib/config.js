const csp = function (nonce) {
    let csp = [
        `default-src 'nonce-${nonce}' 'unsafe-eval' https:`,
        `img-src vscode-resource:`,
        `script-src 'nonce-${nonce}' 'unsafe-eval' https: cdn.jsdelivr.net 'self'`,
        `style-src vscode-resource: 'nonce-${nonce}'`,
        `font-src vscode-resource: 'nonce-${nonce}'`
    ]

    return csp.join(';')
}

const webResources = [
    {
        name: 'webview_uri',
        folder: 'src/webview',
        file: 'scripts.js'
    },
    {
        name: 'app_uri',
        folder: 'src/webview',
        file: 'app.js'
    },    
    {
        name: 'dcs_uri',
        folder: 'src/webview/components',
        file: 'data-connections.js'
    }, 
    {
        name: 'dc_uri',
        folder: 'src/webview/components',
        file: 'data-connection.js'
    },     
    {
        name: 'fls_uri',
        folder: 'src/webview/components',
        file: 'files.js'
    },
    {
        name: 'fl_uri',
        folder: 'src/webview/components',
        file: 'file.js'
    },
    {
        name: 'loader_uri',
        folder: 'src/webview/components',
        file: 'loader.js'
    },     
    {
        name: 'styles_uri',
        folder: 'src/webview',
        file: 'styles.css'
    },
    {
        name: 'jquery_uri',
        folder: 'src/resources/js',
        file: 'jquery.min.js'
    },
    {
        name: 'vue_uri',
        folder: 'src/resources/js',
        file: 'vue.min.js'
    },
    {
        name: 'vuex_uri',
        folder: 'src/resources/js',
        file: 'vuex.min.js'
    },
    {
        name: 'store_uri',
        folder: 'src/webview',
        file: 'store.js'
    },            
    {
        name: 'leonardo_js',
        folder: 'src/resources/js',
        file: 'leonardo-ui.min.js'
    },
    {
        name: 'leonardo_css',
        folder: 'src/resources/css',
        file: 'leonardo-ui.min.css'
    },
    {
        name: 'lui_woff',
        folder: 'src/resources/fonts',
        file: 'lui-icons.woff'
    },
    {
        name: 'lui_ttf',
        folder: 'src/resources/fonts',
        file: 'lui-icons.ttf'
    },
    {
        name: 'hack_ttf',
        folder: 'src/resources/fonts',
        file: 'Hack-Regular.ttf'
    },
]

module.exports = {
    csp,
    webResources
}