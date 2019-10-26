Vue.component('tableButton', {
    props: ['tableData'],
    methods: {
    },
    computed: {
    },
    created: function () {

    },
    template: `<li class="lui-list__item">
        <div class="table-item">
            <label class="lui-checkbox">
                <input class="lui-checkbox__input" type="checkbox" aria-label="Label" />
                <div class="lui-checkbox__check-wrap">
                    <span class="lui-checkbox__check"></span>
                    <span class="lui-checkbox__check-text"></span>
                </div>
            </label>
            <span class="lui-list__text">{{tableData.qName}}</span>
        </div>            
        </li>
`,
})