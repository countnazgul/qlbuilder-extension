Vue.component('data-preview', {
    data: {
    },
    methods: {
        goBack: function () {
            store.dispatch('setDataPreviewVisible', false);
        },
        copyToClipboard: function () {
            store.dispatch('copyToClipboard', false);
        }
    },
    computed: {
        tableData() {
            return store.getters.dataPreview
        },
        fileType() {
            return store.getters.fileType
        },
        fileTables() {
            return store.getters.fileTables
        },
        currentFile() {
            return store.getters.currentFile
        },
        currentTable() {
            return store.getters.currentTable
        },
        loadScript() {
            return store.getters.loadScript
        }
    },
    created: function () {

    },
    template: `<div class="data-preview">
    <div class="data-preview-header">
        <div class="data-preview-ops">
            <span @click="goBack" class="lui-icon  lui-icon--back link" aria-hidden="true"
                title="Back to data connections"></span>
            <div>{{currentFile}}</div>
        </div>
        <div>
            <csv v-if="fileType.combinedType =='single' && fileType.qType !='QVD'" :fileType="fileType"
                :tableData="tableData"></csv>
            <csv v-if="fileType.combinedType =='excel' || fileType.combinedType =='xml'" :fileType="fileType"
                :tableData="tableData" :fileTables="fileTables" :currentTable="currentTable"></csv>
        </div>
    </div>
    <!-- <div class="data-preview-table-container"> -->
        <div class="data-preview-table1">
            <div class="fields-list">
                <!--<ul class="lui-list">-->
                <tableButton v-for="tableData in fileTables" :tableData="tableData" :currentTable="currentTable"></tableButton>
                <!--</ul>-->
            </div>
            <div class="table-container">
                <table class="data-preview-table">
                    <thead>
                        <th v-for="head in tableData.header" :key="head">{{head}}</th>
                    </thead>
                    <tbody>
                        <tr v-for="row in tableData.rows">
                            <td v-for="cell in row.qValues" :title="cell">{{cell}}</td>
                        </tr>
                    <tbody>
                </table>
            </div>
            <div class="loadScript-container">
                <div class="loadScript-header">
                    <button @click="copyToClipboard" class="lui-button lui-button--gradient load-button"
                        title="Copy to clipboard">Copy</button>
                    <!--<button class="lui-button lui-button--gradient load-button" title="Insert into the currently open file">Insert</button>-->
                </div>
                <div class="loadScript">{{loadScript}}</div>
            </div>
        </div>
    <!-- </div> -->
</div>`,
})