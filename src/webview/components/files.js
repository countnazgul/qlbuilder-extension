Vue.component('files-list', {
    data: function () {
        return {
            searchString: ''
        }
    },
    methods: {
        goBack: function () {
            store.dispatch('goBack')
        },
        clearSearchString: function () {
            this.searchString = ''
        },
        refreshFiles: function () {
            store.dispatch('refreshFolderContent');
        }
    },
    computed: {
        files() {
            return store.getters.files
        },
        filteredFiles: function () {
            let self = this

            return self.files.filter(function (f) {
                return f.qName.toLowerCase().indexOf(self.searchString.toLowerCase()) >= 0
            })
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
        <div><span @click="refreshFiles" class="lui-icon  lui-icon--reload link" aria-hidden="true" title="Refresh the files list"></span></div>
        <div class="path" :title="currentFullFolder">{{currentFullFolder}}</div>
            <div class="lui-search">
                <span class="lui-icon  lui-icon--search  lui-search__search-icon"></span>
                <input v-model="searchString" class="lui-search__input" maxength="255" spellcheck="false" type="text" placeholder="Search"/>
                <button @click="clearSearchString" class="lui-search__clear-button">
                    <span class="lui-icon  lui-icon--small  lui-icon--close"></span>
                </button>
            </div>
    </div>
    <div class="f-list">
        <ul class="lui-list">
            <file v-for="file in filteredFiles" :key="file.qName" :file="file" ></file>
        </ui>
    </div>
    </div>`,
})