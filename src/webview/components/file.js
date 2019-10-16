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
        }
    },
    created: function () {
        this.typeClass = `lui-icon--${this.file.qType.toLowerCase()}`
        this.type = this.file.qType.toLowerCase()
    },
    template: `
    <div class="file">
      <div><span class="lui-icon" :class="typeClass" aria-hidden="true"></span></div>
      <div :title="file.qName" class="link" @click="fileClick">{{file.qName}}</div>
    </div>
    `,
})
