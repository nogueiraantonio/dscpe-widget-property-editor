<template>
    <v-layout align-center class="mx-12 my-6">
        <v-item-group v-model="window" class="shrink mr-6" mandatory tag="v-flex">
            <v-item v-for="n in length" :key="n" v-slot:default="{ active, toggle }">
                <div>
                    <v-btn :input-value="active" icon @click="toggle">
                        <v-icon>mdi-record</v-icon>
                    </v-btn>
                </div>
            </v-item>
        </v-item-group>

        <v-flex>
            <v-window v-model="window" class="elevation-1" vertical>
                <v-window-item v-for="n in length" :key="n">
                    <v-card flat>
                        <v-card-text>
                            <v-layout align-center mb-4>
                                <v-avatar color="grey" class="mr-4" />
                                <strong class="title">Please start writting an how to {{ n }}</strong>
                                <v-spacer />
                                <v-btn icon>
                                    <v-icon>mdi-account</v-icon>
                                </v-btn>
                            </v-layout>

                            <p>
                                starting with what are the basics skills to develop, what should be known and url to official trainings for vue, vuex, webpack
                                and vuetify, continuing with what are the purpose of the files devivered in the template.
                            </p>

                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                                in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>

                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                                in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </v-card-text>
                    </v-card>
                </v-window-item>
            </v-window>
        </v-flex>
    </v-layout>
</template>

<!-- no scope for app.vue, style defined here is global for the app -->
<style>
</style>

<script>
export default {
    data: () => ({
        length: 3,
        window: 0
    })
};
</script>
