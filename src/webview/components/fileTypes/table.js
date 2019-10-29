Vue.component('tableButton', {
    props: ['tableData', 'currentTable'],
    methods: {
        tablePreview: function () {
            store.dispatch('changeTable', this.tableData.qName);
        }
    },
    computed: {
        tableSelected() {
            if (this.currentTable == this.tableData.qName) {
                return 'table-selected'
            } else {
                return ''
            }
        },
    },
    created: function () {
        console.log(this.currentTable)
    },
    template: `
    <div class="table-item" :class="tableSelected">
    <label class="lui-checkbox">
        <input class="lui-checkbox__input" type="checkbox" aria-label="Label" />
        <div class="lui-checkbox__check-wrap">
            <span class="lui-checkbox__check"></span>
        </div>
    </label>
    <span @click="tablePreview" class="lui-list__text link">{{tableData.qName}}</span>
</div>            
`,
})
