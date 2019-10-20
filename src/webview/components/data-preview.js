Vue.component('data-preview', {
    data: {
    },
    methods: {
        goBack: function () {
            store.dispatch('setDataPreviewVisible', false);
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
        }
    },
    created: function () {

    },
    template: `<div class="data-preview">
    <div class="data-preview-header">
        <div class="data-preview-ops">
            <span @click="goBack" class="lui-icon  lui-icon--back link" aria-hidden="true" title="Back to data connections"></span>            
            <div>{{currentFile}}</div>
        </div>        
        <div>
        <csv v-if="fileType.qType =='CSV'" :fileType="fileType" :tableData="tableData" :fileTables="fileTables"></csv>
        <csv v-if="fileType.qType =='EXCEL_OOXML'" :fileType="fileType" :tableData="tableData"></csv>
        </div>
    </div>
    <div class="data-preview-table-container">
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
</div>`,
})