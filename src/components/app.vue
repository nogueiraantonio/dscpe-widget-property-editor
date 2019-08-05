<template>
    <v-app>
        <v-content>
            <v-container fluid fill-height ma-0 pa-0>
                <v-layout align-center justify-center row fill-height> {{ message }} - {{ hello }} </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
export default {
    name: "App",
    components: {},
    data: function() {
        return {
            hello: "3DExperience Widget"
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
