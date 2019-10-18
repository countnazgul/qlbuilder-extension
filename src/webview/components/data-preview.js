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
        }
    },
    created: function () {

    },
    template: `<div class="data-preview">
        <div class="data-preview-header">
        <div><span @click="goBack" class="lui-icon  lui-icon--back link" aria-hidden="true" title="Back to data connections"></span></div>
            </div>
        <table>
            <thead>
                <th v-for="head in tableData.header" :key="head">{{head}}</th>
            </thead>
            <tbody>
                <tr v-for="row in tableData.rows">
                    <td v-for="cell in row.qValues" :title="cell">{{cell}}</td>
                </tr>
            <tbody>
        </table>    
    </div>`,
})