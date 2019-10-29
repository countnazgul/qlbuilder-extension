Vue.component('data-connection', {
    props: ['dc', 'currentDataConnection'],
    data: function () {
        return {
            bold: {},
            backgroundColor: {}
        }
    },
    methods: {
        getFiles: function () {
            store.dispatch('getFiles', this.dc);
        }
    },
    computed: {
        currentDataConnection() {
            return store.getters.currentDataConnection
        },
    },
    watch: {
        currentDataConnection(newConnection, oldCount) {
            let self = this
            if (newConnection.label == self.dc.label) {
                self.bold = {
                    'font-weight': 'bold'
                }

                self.backgroundColor = {
                    'background-color': 'grey'
                }
            } else {
                self.bold = { 'font-weight': 'normal' }
                self.backgroundColor = {}
            }
        }
    },
    template: `
    <li class="lui-list__item" :style="backgroundColor">
        <span class="lui-list__aside lui-icon  lui-icon--folder" aria-hidden="true" :style="bold"></span>
        <span @click="getFiles" class="lui-list__text link" :style="bold">{{dc.label}}</span>
    </li>
    `,
})
