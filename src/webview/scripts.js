$(document).ready(function () {
    const vscode = acquireVsCodeApi();

    let folderCurrentLevel = []
    let folderCurrentConnectionId = ''


    window.addEventListener('message', event => {

        const message = event.data;

        switch (message.command) {
            case 'docOpen':
                $("#loading").html('Retrieveing the data connections ...')
                vscode.postMessage({
                    command: 'getConnections'
                })
                break;
            case 'sendConnections':
                let connectionsTable = '<table>';

                for (let item of message.text) {
                    // item.connectionString
                    connectionsTable += `<tr><td><span data-qid="${item.qId}" class="dc-${item.description}">${item.label}</span></td><td>${item.description}</td><td>${item.qId}</td></tr>`
                }

                connectionsTable += '</table>';
                $("#connections").html(connectionsTable);
                $('#loading').hide()
                $('#connections').show()
                break;
            case 'sendFiles':
                $('#filesList').empty()
                let filesTable = '<table>';

                for (let item of message.text) {
                    filesTable += `<tr><td><span data-qconnectionid="${message.connectionId}" data-qname="${item.qName}" data-qtype="${item.qType}" class="file-${item.description}">${item.qName}</span></td><td>${item.qType}</td></tr>`
                }

                filesTable += '</table>';
                $("#filesList").html(filesTable);
                $('#connections').hide()
                $('#filesList').show()
                break;
        }
    });

    $(document).on('click', 'span[class^=dc-]', function () {
        folderCurrentConnectionId = $(this).data('qid')
        vscode.postMessage({
            command: 'getFiles',
            connectionId: $(this).data('qid'),
            path: folderCurrentLevel.join('\\')
        })
    });

    $(document).on('click', 'span[class^=file-]', function () {
        if ($(this).data('qtype') == 'FOLDER') {
            folderCurrentLevel.push($(this).data('qname'))

            vscode.postMessage({
                command: 'getFiles',
                connectionId: folderCurrentConnectionId,
                path: folderCurrentLevel.join('\\')
            })
        }

        if ($(this).data('qtype') == 'FILE') {
            vscode.postMessage({
                command: 'getFileDataPreview',
                connectionId: folderCurrentConnectionId,
                path: folderCurrentLevel.join('\\') + $(this).data('qname')
            })
        }

    });

    $('#filesListUP').on('click', function () {
        folderCurrentLevel.pop()
        vscode.postMessage({
            command: 'getFiles',
            connectionId: folderCurrentConnectionId,
            path: folderCurrentLevel.join('\\')
        })
    })

});
