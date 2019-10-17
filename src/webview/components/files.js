Vue.component('files-list', {
    methods: {
        goBack: function () {
            store.dispatch('goBack')
        }
    },
    computed: {
        files() {
            return store.getters.files
        },
        currentFullFolder() {
            return store.getters.currentFullFolder
        }
    },
    template: `
    <div class="files">
    <div class="f-header border-bottom">FILES</div>
    <div class="f-ops border-bottom">
        <div><span @click="goBack" class="lui-icon  lui-icon--back up link" aria-hidden="true" title="Up one level"></span></div>
        <div class="path">{{currentFullFolder}}</div>
        <div><input class="lui-input lui-disabled" placeholder="Not working yet" /></div>
    </div>
    <div class="f-list">
      <file v-for="file in files" :key="file.qName" :file="file" ></file>
    </div>
    </div>`,
})


