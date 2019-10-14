const listDataConnections = require('./commands/listDataConnections')

function activate(context) {
	console.log('Congratulations, your extension "qlbuilder-extension" is now active!');

	let t = listDataConnections(context)
	context.subscriptions.push(t);
}
exports.activate = activate;

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
