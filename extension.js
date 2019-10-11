const vscode = require('vscode');
const { webview } = require('./commands/webview')


function activate(context) {
	console.log('Congratulations, your extension "qlbuilder-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World!');
	});

	let listDataConnections = vscode.commands.registerCommand('listDataConnections', function () {
		vscode.window.showErrorMessage('Test');
	})

	context.subscriptions.push(webview)

	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('dataSelect', () => {
	// 		// Create and show a new webview
	// 		const panel = vscode.window.createWebviewPanel(
	// 			'dataSelect', // Identifies the type of the webview. Used internally
	// 			'Data Select', // Title of the panel displayed to the user
	// 			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
	// 			{} // Webview options. More on these later.
	// 		);

	// 		panel.webview.html = getWebviewContent()
	// 	})
	// )


	context.subscriptions.push(disposable);
	context.subscriptions.push(listDataConnections);
}
exports.activate = activate;

function deactivate() { }



module.exports = {
	activate,
	deactivate
}
