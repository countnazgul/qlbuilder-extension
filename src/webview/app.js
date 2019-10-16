Vue.component('user-name', {
    data: function () {
        return {
            dcList: [],
            temp: false
        }
    },
    computed: {
        loaders() {
            return store.getters.loaders
        },
        showers() {
            return store.getters.showers
        },
        vscode() {
            return store.getters.vscode
        }
    },
    methods: {
        getConnections: function () {
            this.dcList = []
            this.vscode.postMessage({
                command: 'getConnections'
            })
        }
    },
    created: function () {
        let self = this

        let vscode = acquireVsCodeApi();
        self.vscode = vscode
        store.dispatch('setVSCode', vscode)

        window.addEventListener('message', function (event) {
            const message = event.data;

            switch (message.command) {
                case 'docOpen':
                    self.getConnections()
                    break;
                case 'sendConnections':
                    store.dispatch('setConnections', message.text)
                    break;
                case 'sendFiles':
                    store.dispatch('setFiles', message.text)
                    break;
            }

        });
    },
    template: `
    <div class="main">
      <div class="container" v-if="loaders.main">
        <data-connections :dcList="dcList" @refreshDCList="getConnections"></data-connections>
        <div v-if="showers.files" class="fl" :class="{ center: !loaders.files }">
          <files-list v-if="loaders.files"></files-list>
          <div v-if="!loaders.files">
            <loader/>
          </div>
        </div>
      </div>
      <div v-if="!loaders.main" class="main-loader">
        <loader/>
      </div>
    </div>
    `
})

Vue.use(Vuex)

var app = new Vue({
    el: '#app'
})
