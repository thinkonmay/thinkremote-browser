/** @type {import('next').NextConfig} */
module.exports = {
    serverRuntimeConfig: {
    },
    publicRuntimeConfig: {
        NEXT_PUBLIC_AUTH_API: process.env.NEXT_PUBLIC_AUTH_API,
        NEXT_PUBLIC_SIGNALING_URL: process.env.NEXT_PUBLIC_SIGNALING_URL
    }
}
