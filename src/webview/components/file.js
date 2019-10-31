Vue.component('file', {
    props: ['file'],
    data: {
        typeClass: '',
        type: ''
    },
    methods: {
        fileClick: function () {
            if (this.type == 'folder') {
                store.dispatch('getFolderContent', this.file.qName);
            }

            if (this.type == 'file') {                
                store.dispatch('getLoadScript', this.file.qName);
                // store.dispatch('getDataPreview', this.file.qName);
            }            
        }
    },
    created: function () {
        this.typeClass = `lui-icon--${this.file.qType.toLowerCase()}`
        this.type = this.file.qType.toLowerCase()
    },
    template: `
    <li class="lui-list__item">
        <span class="lui-list__aside lui-icon" :class="typeClass" aria-hidden="true"></span>
        <span :title="file.qName" @click="fileClick" class="lui-list__text link">{{file.qName}}</span>
    </li>        
    `,
})
