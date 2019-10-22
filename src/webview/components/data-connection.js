Vue.component('data-connection', {
    props: ['dc'],
    methods: {
        getFiles: function () {
            store.dispatch('getFiles', this.dc);
        }
    },
    template: `
    <li class="lui-list__item">
        <span class="lui-list__aside lui-icon  lui-icon--folder" aria-hidden="true"></span>
        <span @click="getFiles" class="lui-list__text link">{{dc.label}}</span>
    </li>
    `,
})
