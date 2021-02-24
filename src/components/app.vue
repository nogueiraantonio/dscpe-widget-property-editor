/* eslint-disable vue/component-tags-order */
<template>
    <v-app class="v-cloak">
        <v-main>
            <v-container class="fill-height ma-0 pa-0 fluid">
                <!-- document drop area -->
                <v-row v-show="$store.getters.isDocumentUnloaded" align="center" justify="center">
                    <div class="droparea">Drag document from Bookmark Editor</div>
                </v-row>
                <v-overlay :value="$store.state.isDocumentLoading || $store.state.isDocumentSaving" opacity="0.25" light="true">
                    <v-progress-circular
                        indeterminate
                        size="96"
                    >
                        <v-row v-show="$store.state.isDocumentLoading" align="center" justify="center">Loading</v-row>
                        <v-row v-show="$store.state.isDocumentSaving" align="center" justify="center">Saving</v-row>
                    </v-progress-circular>
                </v-overlay>
                <!-- document properties area -->
                <document-editor v-show="$store.state.isDocumentLoaded || $store.state.isDocumentSaving" id="documentEditor" ref="documentEditor" transition="fade-transition" />
            </v-container>
        </v-main>
    </v-app>
</template>

<!-- no scope for app.vue, style defined here is global for the app -->

<script>
import documentEditor from "./document-editor.vue";

// widget object is available everywhere !
console.debug(widget);

// export let isAppMounted = false;
export default {
    name: "App",
    components: { documentEditor },
    data: function () {
        return {
            mounted: false
        };
    },
    beforeUpdate () {
        console.debug("WCAE: VueJS beforeUpdate!");
    },
    updated () {
        console.debug("WCAE: VueJS updated!");
    },
    mounted () {
       // isAppMounted = true;
        console.debug("WCAE: VueJS mounted!");
    },
    created () {
        console.debug("WCAE: VueJS created!");
    },
    methods: {
        getDocumentEditor: function() { return this.$refs.documentEditor; }
    }
};
</script>

<style>
html,
body {
    overflow-y: auto !important;
    overflow-x: hidden !important;
}
.v-cloak
{
    display: none;
}
.progress
{
   background-color: aquamarine;
}
</style>
