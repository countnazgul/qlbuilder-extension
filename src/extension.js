const listDataConnections = require('./commands/listDataConnections')

function activate(context) {
	// console.log('Congratulations, your extension "qlbuilder-extension" is now active!');
	context.subscriptions.push(listDataConnections(context));
}
exports.activate = activate;

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
