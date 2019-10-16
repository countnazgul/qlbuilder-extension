Vue.component('data-connection', {
    props: ['dc'],
    methods: {
        getFiles: function () {
            store.dispatch('getFiles', this.dc);
        }
    },
    template: `
    <div class="dc">
      <div><span class="lui-icon  lui-icon--folder" aria-hidden="true"></span></div>
      <div @click="getFiles" class="link">{{dc.label}}</div>
      <div><span class="lui-icon lui-disabled  lui-icon--edit link" aria-hidden="true" title="Edit (Disabled)"></span></div>
      <div><span @click="getFiles" class="lui-icon lui-disabled lui-icon--table link" aria-hidden="true" title="Select data"></span></div>
    </div>`,
})


