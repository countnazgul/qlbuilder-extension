Vue.component('tableButton', {
    props: ['tableData', 'currentTable', 'activeScripts', 'fileType'],
    data() {
        return {
            addScript: false
        }
    },
    methods: {
        tablePreview: function () {
            if(this.fileType.combinedType != 'single') {
                store.dispatch('changeTable', this.tableData);
            }
        },
        clicked: function(event) {
            let t = this.activeScript
            store.dispatch('changeScript', {tableName: this.tableData, state: t});
        }
    },
    computed: {
        tableSelected() {
            if (this.currentTable == this.tableData) {
                return 'table-selected'
            } else {
                return ''
            }
        },
        tableSelectedCheck() {
            if (this.currentTable == this.tableData) {
                return true
            } else {
                return false
            }
        },
        activeScript() {
            if( this.activeScripts.indexOf(this.tableData) > -1 ) {
                return true
            } else {
                return false
            }
        },
        disabledCheck: function() {
            if(this.fileType.combinedType == 'single') {
                return true
            } else {
                return false
            }
        }
    },
    created: function () {
        // console.log(this.currentTable)
    },
    template: `
    <div class="table-item" :class="tableSelected">
    <label class="lui-checkbox">
        <input v-model="addScript" v-model="activeScript" :disabled="disabledCheck" @change="clicked($event)" class="lui-checkbox__input" type="checkbox" aria-label="Label" />
        <div class="lui-checkbox__check-wrap">
            <span class="lui-checkbox__check"></span>
        </div>
    </label>
    <span @click="tablePreview" class="lui-list__text" :class="{link: !disabledCheck}">{{tableData}}</span>
</div>            
`,
})
