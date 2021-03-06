const store = new Vuex.Store({
    state: {
        vscode: '',
        dataConnections: [],
        files: [],
        current: {
            dataConnection: '',
            file: '',
            folderLevel: []
        },
        showers: {
            files: false
        },
        loaders: {
            main: false,
            dataConnections: false,
            files: false
        },
        isDataPreview: false,
        dataPreview: {
            header: [],
            rows: []
        },
        fileType: {},
        fileTables: [],
        currentTable: '',
        loadScript: '',
        loadScriptActive: '',
        loadScripts: [],
        activeScripts: []
    },
    mutations: {
        SET_VSCODE: function (state, vscode) {
            state.vscode = vscode
        },
        SET_CONNECTIONS: function (state, connections) {
            state.dataConnections = connections
        },
        SET_CURRENT_DC: function (state, connection) {
            state.current.dataConnection = connection
        },
        SET_CURRENT_LEVEL: function (state, folder) {
            state.current.folderLevel.push(folder)
        },
        SET_CURRENT_LEVEL_BACK: function (state) {
            state.current.folderLevel.pop()
        },
        SET_CURRENT_FILE: function (state, data) {
            state.current.file = data
        },
        SET_FILES: function (state, files) {
            state.files = files
        },
        SET_LOADER: function (state, { loader, value }) {
            state.loaders[loader] = value
        },
        SET_SHOWER: function (state, { shower, value }) {
            state.showers[shower] = value
        },
        SET_DATAPREVIEW: function (state, data) {
            state.dataPreview = data.tableData
            state.fileType = data.fileType
            // state.loadScript = data.loadScript

            // if (data.fileTables.length > 0) {
            //     state.fileTables = data.fileTables
            // }

            // state.currentTable = data.currentTable
            state.isDataPreview = true
        },
        SET_DATAPREVIEW_VISIBLE: function (state, data) {
            state.isDataPreview = data.tableData
            state.dataPreview = {
                header: [],
                rows: []
            }

            state.fileType = {}
        },
        CHANGE_TABLE: function (state, data) {
            state.currentTable = data
        },
        SET_LOAD_SCRIPTS: function(state, data) {
            state.currentTable = data.activeTable
            state.activeScripts = [data.scripts[0].tableName]
            state.loadScriptActive = data.scripts[0].script
            state.loadScripts = data.scripts
            state.fileTables = data.scripts.map(function(f) {
                return f.tableName
            })
        },
        UPDATE_LOAD_SCRIPT: function(state, data) {
            // let currentState = state.loadScripts

            let scriptObj = state.loadScripts.find((p) => {
                return p.tableName === data.tableName;
            });
            
            scriptObj.active = !data.state


            let activeScripts = state.loadScripts.filter(function(s) {
                return s.active == true
            })
            .map(function(s) {
                return s.script
            })
            
            state.loadScriptActive = activeScripts.join('\n\n\n')

            // state.loadScripts = currentState
        },
        SET_ACTIVE_SCRIPTS: function(state, data) {
            if(data.state == true) {
                state.activeScripts.splice(state.activeScripts.indexOf(data.tableName), 1)
            } else {
                state.activeScripts.push(data.tableName)
            }

            let a = 1
        }
    },
    actions: {
        setVSCode: function ({ commit }, data) {
            commit('SET_VSCODE', data)
        },
        setConnections: function ({ commit }, data) {
            commit('SET_CONNECTIONS', data)
            commit('SET_LOADER', { loader: 'main', value: true })

        },
        getFiles: function ({ commit, state }, data) {
            commit('SET_CURRENT_DC', data)
            commit('SET_SHOWER', { shower: 'files', value: true })
            state.vscode.postMessage({
                command: 'getFiles',
                data: {
                    connectionId: data.qId,
                    path: state.current.folderLevel.join('\\')
                }
            })
        },
        getFolderContent: function ({ commit, state }, data) {
            commit('SET_CURRENT_LEVEL', data)

            state.vscode.postMessage({
                command: 'getFiles',
                data: {
                    connectionId: state.current.dataConnection.qId,
                    path: state.current.folderLevel.join('\\')
                }
            })
        },
        refreshFolderContent: function ({ commit, state }) {
            state.vscode.postMessage({
                command: 'getFiles',
                data: {
                    connectionId: state.current.dataConnection.qId,
                    path: state.current.folderLevel.join('\\')
                }
            })
        },
        goBack: function ({ commit, state }) {
            commit('SET_CURRENT_LEVEL_BACK')

            state.vscode.postMessage({
                command: 'getFiles',
                data: {
                    connectionId: state.current.dataConnection.qId,
                    path: state.current.folderLevel.join('\\')
                }
            })
        },
        setFiles: function ({ commit, state }, data) {
            commit('SET_FILES', data)
            commit('SET_LOADER', { loader: 'files', value: true })
        },
        getLoadScript: function({commit, state}, data) {
            let path = data

            if (state.current.folderLevel.length > 0) {
                path = state.current.folderLevel.join('/') + '/' + data
            }

            state.vscode.postMessage({
                command: 'getLoadScript',
                data: {
                    connectionId: state.current.dataConnection.qId,
                    connection: state.current.dataConnection,
                    path: path
                }
            })            

        },
        getDataPreview: function ({ commit, state }, data) {

            let path = data

            if (state.current.folderLevel.length > 0) {
                path = state.current.folderLevel.join('/') + '/' + data
            }

            state.vscode.postMessage({
                command: 'getDataPreview',
                data: {
                    connectionId: state.current.dataConnection.qId,
                    connection: state.current.dataConnection,
                    path: path,
                    currentTable: state.fileTables[0]
                }
            })
            commit('SET_CURRENT_FILE', data)
        },
        setDataPreviewSingleTable: function ({ commit, state }, data) {
            let rowsData = [...data.dataPreview.qPreview]
            rowsData.splice(0, 1)

            let tableData = {
                header: data.dataPreview.qPreview[0].qValues,
                rows: rowsData
            }

            // let currentTable = data.currentTable
            // if (currentTable == '' && !data.fileTables) {
            //     currentTable = data.fileTables[0].qName
            // }

            commit('SET_DATAPREVIEW', { 
                tableData: tableData, 
                fileType: data.fileType, 
                fileTables: [], 
                currentTable: '', 
                loadScript: data.loadScript 
            })
        },
        setDataPreviewExcel: function ({ commit, state }, data) {
            let rowsData = [...data.dataPreview.qPreview]
            rowsData.splice(0, 1)

            let tableData = {
                header: data.dataPreview.qPreview[0].qValues,
                rows: rowsData
            }

            let currentTable = data.currentTable

            if (currentTable == '' && !data.fileTables) {
                currentTable = data.fileTables[0].qName
            }

            commit('SET_DATAPREVIEW', { 
                tableData: tableData, 
                fileType: data.fileType, 
                fileTables: data.fileTables, 
                // currentTable: currentTable, 
                // loadScript: data.loadScript
            })
        },
        setDataPreviewAdditional: function({commit, state}, data) {

        },
        setDataPreviewVisible: function ({ commit }, data) {
            commit('SET_DATAPREVIEW_VISIBLE', data)
        },
        changeFileType: function ({ state, commit }, data) {
            let options = state.fileType
            options[data.prop] = data.value

            let path = state.current.file

            if (state.current.folderLevel.length > 0) {
                path = state.current.folderLevel.join('/') + '/' + state.current.file
            }

            state.vscode.postMessage({
                command: 'getDataPreview',
                data: {
                    connectionId: state.current.dataConnection.qId,
                    connection: state.current.dataConnection,
                    path: path,
                    options: options
                }
            })

        },
        changeTable: function ({ state, commit }, data) {

            let path = state.current.file

            if (state.current.folderLevel.length > 0) {
                path = state.current.folderLevel.join('/') + '/' + state.current.file
            }

            commit('CHANGE_TABLE', data)

            state.vscode.postMessage({
                command: 'getDataPreview',
                data: {
                    connectionId: state.current.dataConnection.qId,
                    connection: state.current.dataConnection,
                    path: path,
                    options: state.fileType,
                    currentTable: data
                }
            })
            
        },
        setLoadScripts: function({state, commit}, data) {
            data[0].active = true

            commit('SET_LOAD_SCRIPTS', {scripts: data, activeTable: data[0].tableName })
        },
        changeScript: function({state, commit}, data) {
            commit('SET_ACTIVE_SCRIPTS', data)
            commit('UPDATE_LOAD_SCRIPT', data)
        },
        // updateLoadScript: function({state, commit}, data) {
        //     commit('UPDATE_LOAD_SCRIPT', data)
        // },
        copyToClipboard: function ({ state }) {
            state.vscode.postMessage({
                command: 'copyToClipboard',
                data: {
                    loadScript: state.loadScript,
                }
            })
        }
    },
    getters: {
        loadScript_old: function (state) {
            return state.loadScript
        },
        loadScript: function (state) {
            return state.loadScriptActive
            // let activeScripts = state.loadScripts.filter(function(s) {
            //     return s.active == true
            // })
            // .map(function(s) {
            //     return s.script
            // })
            
            // return activeScripts.join('\n\n\n')
        },        
        connections: function (state) {
            // return state.dataConnections.filter(function (d) {
            //     return d.description == 'folder'
            // })
            return state.dataConnections
        },
        files: function (state) {
            return state.files
        },
        vscode: function (state) {
            return state.vscode
        },
        currentFullFolder: function (state) {
            if (state.current.dataConnection.connectionString) {
                return `${state.current.dataConnection.connectionString}${state.current.folderLevel.join('\\')}`
            }

            return ''
        },
        currentFile: function (state) {
            return state.current.file
        },
        currentDataConnection: function (state) {
            return state.current.dataConnection
        },
        loaders: function (state) {
            return state.loaders
        },
        showers: function (state) {
            return state.showers
        },
        isDataPreview: function (state) {
            return state.isDataPreview
        },
        dataPreview: function (state) {
            return state.dataPreview
        },
        fileType: function (state) {
            return state.fileType
        },
        fileTables: function (state) {
            return state.fileTables
        },
        currentTable: function (state) {
            return state.currentTable
        },
        activeScripts: function(state) {
            return state.activeScripts
            // return state.loadScripts.filter(function(s) {
            //     return s.active == true
            // }).map(function(s) {
            //     return s.tableName
            // })
        }
    }
})