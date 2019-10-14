const vscode = require('vscode');
const webview = require('./commands/webview')
const listDataConnections = require('./commands/listDataConnections')
// const fs = require('fs');

function activate(context) {
	console.log('Congratulations, your extension "qlbuilder-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// let b = fs.readFileSync('c:/Users/Home/.qlbuilder.yml').toString()
		// vscode.window.showInformationMessage('Hello World!');
		vscode.window.showQuickPick(['test', 'test1', 'test2'])
	});

	// let listDataConnections = vscode.commands.registerCommand('listDataConnections', function () {
	// 	vscode.window.showErrorMessage('Test');
	// })

	context.subscriptions.push(webview)
	context.subscriptions.push(disposable);
	context.subscriptions.push(listDataConnections(context));
}
exports.activate = activate;

function deactivate() { }



module.exports = {
	activate,
	deactivate
}
