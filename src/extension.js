const dataConnections = require('./commands/dataConnections')

function activate(context) {
	context.subscriptions.push(dataConnections(context));
}
exports.activate = activate;

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
