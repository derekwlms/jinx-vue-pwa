module.exports = {
    pwa: {
        name: 'jinx-vue-pwa',
        iconPaths: {
            favicon32: 'images/icons/favicon-32x32.png',
            favicon16: 'images/icons/favicon-16x16.png',
            appleTouchIcon: 'images/icons/apple-icon-152x152.png',
            maskIcon: 'images/icons/safari-pinned-tab.svg',
            msTileImage: 'images/icons/ms-icon-144x144.png'
        },
        themeColor: '#00008b',
        workboxPluginMode: 'injectManifest',
        workboxOptions: {
            swSrc: 'src/service-worker.js'
        }
    }
}
  