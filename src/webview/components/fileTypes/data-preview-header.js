Vue.component('data-preview-header', {
    props: ['fileType', 'tableData', 'fileTables', 'currentTable'],
    methods: {
        goBack: function () {
            store.dispatch('setDataPreviewVisible', false);
        },
        changeFieldName: function (event) {
            store.dispatch('changeFileType', { prop: 'qLabel', value: event.target.value });
        },
        changeQuoting: function (event) {
            store.dispatch('changeFileType', { prop: 'qQuote', value: event.target.value });
        },
        changeHeaderSizePlus: function () {
            store.dispatch('changeFileType', { prop: 'qHeaderSize', value: this.fileType.qHeaderSize + 1 });
        },
        changeHeaderSizeMinus: function () {
            store.dispatch('changeFileType', { prop: 'qHeaderSize', value: this.fileType.qHeaderSize - 1 });
        },
        changeTable: function (event) {
            store.dispatch('changeTable', event.target.value);
        }
    },
    computed: {
        fileTypeClass() {
            if (this.fileType.combinedType == 'single' && this.fileType.qType == 'CSV') return 'csv-options'
            if (this.fileType.combinedType == 'excel') return 'excel-options'
            if (this.fileType.combinedType == 'xml') return 'excel-options'
        }       
    },
    created: function () {

    },
    template: `<div>
        <div :class="fileTypeClass">
        
        <!--<div v-if="fileTables && fileTables.length > 0" class="options-components">
            <div class="label">Tables</div>
            <select v-model="currentTable" @change="changeTable" class="lui-select lui-select--gradient">
                <option  v-for="table in fileTables" :key="table.qName" :value="table.qName">{{table.qName}}</option>
                </select>
        </div>-->

        <div v-if="fileType.combinedType != 'xml'" class="options-components">
            <div class="label">Field names</div>
            <select v-model="fileType.qLabel" @change="changeFieldName" class="lui-select lui-select--gradient">
                <option value="embedded labels" selected>Embedded field name</option>
                <option value="no labels">No labels
                </option>
            </select>
        </div>
        
        <div v-if="fileType.combinedType != 'xml'" class="options-components">
            <div class="label">Header size</div>
            <div>
                <span class="lui-input-group">
                    <button @click="changeHeaderSizeMinus" class="lui-input-group__item lui-input-group__button lui-button"><span class="lui-button__icon">-</span></button>
                    <input type="text" class="lui-input-group__item  lui-input-group__input  lui-input text-center" aria-invalid="false" :value="fileType.qHeaderSize">
                    <button @click="changeHeaderSizePlus"class="lui-input-group__item lui-input-group__button lui-button "><span class="lui-button__icon ">+</span></button>
                </span>
            </div>
        </div>
        
        <div v-if="fileType.combinedType =='single'" class="options-components">
            <div class="label">Quoting</div>
                <select v-model="fileType.qQuote" @change="changeQuoting" class="lui-select lui-select--gradient">
                    <option value="standard">Standard</option>
                    <option value="msq" selected>MSQ</option>
                    <option value="none">None</option>
                </select>
        </div>        
    </div>  
    </div>`,
})