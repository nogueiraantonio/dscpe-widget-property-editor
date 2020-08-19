<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" app>
            <v-list dense>
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Contact</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="indigo" dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title>Application</v-toolbar-title>
        </v-app-bar>

        <v-main>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col class="text-center">
                        <span>{{ message }}</span>
                        <br />
                        <v-btn class="ma-2" text icon color="pink lighten-1" @click="$store.commit('swapMessage')">
                            <v-icon>mdi-heart</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
        <v-footer color="indigo" app>
            <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
    </v-app>
</template>

<!-- no scope for app.vue, style defined here is global for the app -->
<style>
html,
body {
    overflow-y: auto !important;
    overflow-x: hidden !important;
}
</style>

<script>
// widget object is available everywhere !
console.debug(widget);

export default {
    name: "App",
    data() {
        return {
            drawer: false
        };
    },
    computed: {
        message() {
            return this.$store.getters.currentMessage;
        }
    }
};
</script>
