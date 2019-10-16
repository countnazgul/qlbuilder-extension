Vue.component('data-connections', {
    data: {
    },
    methods: {
        refreshDCList: function () {
            this.$emit('refreshDCList')
        }
    },
    computed: {
        dcList() {
            return store.getters.connections
        }
    },
    template: `
    <div class="data-connections">
      <div class="dc-header">Data Connections</div>
      <div @click="refreshDCList" class="dc-control">
        <span class="lui-icon  lui-icon--reload link" aria-hidden="true" title="Refresh the list"></span>
      </div>
      <div class="dc-list" v-for="dc in dcList" :key="dc.qId">
        <data-connection :dc="dc" ></data-connection>
      </div>
    </div>`
})


