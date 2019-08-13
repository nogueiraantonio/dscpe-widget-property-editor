<template>
    <v-app>
        <v-content>
            <v-container fill-height>
                <how-to />
            </v-container>
        </v-content>
    </v-app>
</template>

<!-- no scope for app.vue, style defined here is global for the app -->
<style>
html,
body {
    overflow-y: auto !important;
    height: 100%;
}
</style>

<script>
import HowTo from "./how-to.vue";

// widget object is available everywhere !
console.debug(widget);

export default {
    name: "App",
    components: { HowTo },
    data: function() {
        return {
            hello: "3DExperience Widget :) "
        };
    },
    computed: {
        message: function() {
            return this.$store.state.message;
        }
    },
    watch: {},
    mounted: function() {},
    methods: {}
};
</script>
