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
        currentStyle: function() {
            let self = this
            if (self.currentDataConnection.label == self.dc.label) {
                return "font-weight: bold; background-color: grey"
                // self.bold = {
                //     'font-weight': 'bold'
                // }

                // self.backgroundColor = {
                //     'background-color': 'grey'
                // }
            } else {
                return "font-weight: normal"
                // self.bold = { 'font-weight': 'normal' }
                // self.backgroundColor = {}
            }
        }        
        // currentDataConnection() {
        //     return store.getters.currentDataConnection
        // },
    },
    watch: {
        // currentDataConnection(newConnection, oldCount) {
        //     let self = this
        //     if (newConnection.label == self.dc.label) {
        //         self.bold = {
        //             'font-weight': 'bold'
        //         }

        //         self.backgroundColor = {
        //             'background-color': 'grey'
        //         }
        //     } else {
        //         self.bold = { 'font-weight': 'normal' }
        //         self.backgroundColor = {}
        //     }
        // }
    },
    template: `
    <li class="lui-list__item" :style="currentStyle">
        <span class="lui-list__aside lui-icon  lui-icon--folder" aria-hidden="true" :style=""></span>
        <span @click="getFiles" class="lui-list__text link" :style="bold" >{{dc.label}}</span>
    </li>
    `,
})
