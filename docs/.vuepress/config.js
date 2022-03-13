module.exports = {
    // 站点配置
    lang: 'zh-CN',
    title: 'React源码解析',
    description: '这是一个React源码解析网站。',
    head: [['link', { rel: 'icon', href: '/images/logo.png' }]],

    // 主题和它的配置
    theme: '@vuepress/theme-default',
    themeConfig: {
        logo: '/images/logo.png',
        sidebar: [
            {
                text: '起步',
                link: '/get-started',
            },
            {
                text: '入口篇',
                link: '/entry',
                children:[
                    {
                        text: 'createRoot',
                        link: '/entry/createRoot',
                    }
                ]
            },
        ],
    },
    plugins: [
        ['@vuepress/plugin-search', {
            searchMaxSuggestions: 10
        }],
        ['@vuepress/plugin-shiki',{

        }]
    ]
}