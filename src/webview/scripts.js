$(document).ready(function () {
    const vscode = acquireVsCodeApi();

    let folderCurrentLevel = []
    let folderCurrentConnectionId = ''
    let currentPath = ''
    let currentConnectionString = ''


    window.addEventListener('message', event => {

        const message = event.data;

        switch (message.command) {
            case 'docOpen':
                $("#loading").html('Retrieving the data connections ...')
                vscode.postMessage({
                    command: 'getConnections'
                })
                break;
            case 'sendConnections':
                $('.dc-list').empty()
                let connections = []

                for (let item of message.text) {
                    let d = `<div class="dc">
                    <div><span class="lui-icon  lui-icon--folder" aria-hidden="true"></span></div>
                    <div data-qid="${item.qId}" data-connstring="${item.connectionString}" class="dc-item-${item.description} link">${item.label}</div>
                    <div><span class="lui-icon  lui-icon--edit link" aria-hidden="true" title="Edit"></span></div>
                    <div><span class="lui-icon  lui-icon--table link" aria-hidden="true" title="Select data"></span></div>
                    </div>`

                    connections.push(d)
                }

                $(".dc-list").html(connections.join('\n'));

                break;
            case 'sendFiles':
                $('.f-list').empty()
                let files = []
                // $('#filesList').empty()
                // let filesTable = '<table>';

                for (let item of message.text) {
                    let type = ''
                    if (item.qType == 'FILE') {
                        type = 'file'
                    }

                    if (item.qType == 'FOLDER') {
                        type = 'folder'
                    }

                    let f = `<div class="file">
                    <div><span class="lui-icon  lui-icon--${type}" aria-hidden="true"></span></div>
                    <div title="${item.qName}" data-qconnectionid="${message.connectionId}" data-qname="${item.qName}" data-qtype="${item.qType}" class="file-item-${item.description} link">${item.qName}</div>
                    </div>`

                    files.push(f)
                }

                $('.f-list').html(files.join('\n'))

                // for (let item of message.text) {
                //     filesTable += `< tr > <td><span data-qconnectionid="${message.connectionId}" data-qname="${item.qName}" data-qtype="${item.qType}" class="file-${item.description}">${item.qName}</span></td> <td>${item.qType}</td></tr > `
                // }

                // filesTable += '</table>';
                // $("#filesList").html(filesTable);
                // $('#connections').hide()
                // $('#filesList').show()
                break;
        }
    });

    $(document).on('click', 'div[class^=dc-item-]', function () {
        folderCurrentLevel = []
        folderCurrentConnectionId = $(this).data('qid')
        currentConnectionString = $(this).data('connstring')
        $('.path').html($(this).data('connstring'))
        currentPath = $(this).data('connstring')

        vscode.postMessage({
            command: 'getFiles',
            connectionId: $(this).data('qid'),
            path: folderCurrentLevel.join('\\')
        })
    });

    $(document).on('click', 'div[class^=file-item-]', function () {
        if ($(this).data('qtype') == 'FOLDER') {
            folderCurrentLevel.push($(this).data('qname'))
            currentPath = currentPath + '' + folderCurrentLevel.join('\\')
            $('.path').html(currentPath)

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

    $('.up').on('click', function () {
        folderCurrentLevel.pop()

        currentPath = currentConnectionString + '' + folderCurrentLevel.join('\\')
        $('.path').html(currentPath)

        vscode.postMessage({
            command: 'getFiles',
            connectionId: folderCurrentConnectionId,
            path: folderCurrentLevel.join('\\')
        })
    })

});
