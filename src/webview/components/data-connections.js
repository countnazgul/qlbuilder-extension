Vue.component('data-connections', {
  data: function () {
    return {
      searchString: ''
    }
  },
  methods: {
    refreshDCList: function () {
      this.$emit('refreshDCList')
    },
    clearSearchString: function () {
      this.searchString = ''
    }
  },
  computed: {
    dcList() {
      return store.getters.connections
    },
    currentDataConnection() {
      return store.getters.currentDataConnection
    },
    filteredConnections: function () {
      let self = this

      return self.dcList.filter(function (d) {
        return d.label.toLowerCase().indexOf(self.searchString.toLowerCase()) >= 0
      })
    },
  },
  template: `
  <div class="data-connections">
  <div class="dc-header border-bottom">DATA CONNECTIONS</div>
  <div @click="refreshDCList" class="dc-control border-bottom">
      <span class="lui-icon  lui-icon--reload link" aria-hidden="true" title="Refresh the list"></span>
      <div></div>
      <div class="lui-search">
          <span class="lui-icon  lui-icon--search  lui-search__search-icon"></span>
          <input v-model="searchString" class="lui-search__input" maxength="100" spellcheck="false" type="text"
              placeholder="Search" />
          <button @click="clearSearchString" class="lui-search__clear-button">
              <span class="lui-icon  lui-icon--small  lui-icon--close"></span>
          </button>
      </div>
  </div>
  <div class="dc-list">
      <ul class="lui-list">
          <data-connection v-for="dc in filteredConnections" :key="dc.qId" :dc="dc" :currentDataConnection="currentDataConnection"></data-connection>
      </ul>
  </div>
</div>`
})


