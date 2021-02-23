/* eslint-disable vue/component-tags-order */
<template>
    <v-app class="v-cloak">
        <v-main>
            <!-- <v-container v-cloak fluid> -->
            <v-container class="fill-height ma-0 pa-0 fluid">
                <!-- <div v-cloak id="myWidgetApp" class="container" style="height: 100%; overflow-y: auto;"></div> -->
                <!-- document drop area -->
                <v-row v-show="!$store.state.isDocumentLoaded && !$store.state.isDocumentLoading" align="center" justify="center">
                    <div class="droparea">Drag document from Bookmark Editor</div>
                </v-row>
                <!-- TODO - Some spinner while loading. Bootstrap 4 seems to have some standard spinners however
            I had a few issues with bootstrap 4 where the fonts show up very small -->
                <v-row v-show="$store.state.isDocumentLoading" align="center" justify="center">
                    <v-progress-circular
                        indeterminate
                        color="primary"
                    />
                </v-row>
                <!-- document properties area -->
                <document-editor v-show="$store.state.isDocumentLoaded" id="documentEditor" ref="documentEditor" transition="fade-transition" />
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
