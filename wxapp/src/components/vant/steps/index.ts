// @ts-nocheck
import { Weapp } from '../definitions/weapp';
import { VantComponent } from '../common/component';
import { GREEN, GRAY_DARK } from '../common/color';

VantComponent({
    classes: ['desc-class'],

    props: {
        icon: String,
        steps: Array,
        active: Number,
        direction: {
            type: String,
            value: 'horizontal',
        },
        activeColor: {
            type: String,
            value: GREEN,
        },
        inactiveColor: {
            type: String,
            value: GRAY_DARK,
        },
        activeIcon: {
            type: String,
            value: 'checked',
        },
        inactiveIcon: String,
    },

    methods: {
        onClick(event: Weapp.Event) {
            const { index } = event.currentTarget.dataset;
            this.$emit('click-step', index);
        },
    },
});
