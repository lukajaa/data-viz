// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        'nuxt-icon'
    ],
    app: {
        head: {
            title: 'Data Visualization',
        }
    },
    gtag: {
        id: 'G-QNLZ5NY7HH'
    }
})
