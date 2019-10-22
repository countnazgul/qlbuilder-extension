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
      <div class="dc-header border-bottom">DATA CONNECTIONS</div>
      <div @click="refreshDCList" class="dc-control border-bottom">
        <span class="lui-icon  lui-icon--reload link" aria-hidden="true" title="Refresh the list"></span>
      </div>
      <div class="dc-list">
        <ul class="lui-list">
        <data-connection v-for="dc in dcList" :key="dc.qId" :dc="dc" ></data-connection>
        </ul>
      </div>
    </div>`
})


