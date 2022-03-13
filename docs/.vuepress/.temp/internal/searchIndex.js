export const searchIndex = [
  {
    "title": "欢迎",
    "headers": [
      {
        "level": 2,
        "title": "该项目还在逐步完善中",
        "slug": "该项目还在逐步完善中",
        "children": []
      }
    ],
    "path": "/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "",
    "headers": [],
    "path": "/entry/createRoot.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "入口篇",
    "headers": [],
    "path": "/entry/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "简介",
    "headers": [],
    "path": "/get-started/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "",
    "headers": [],
    "path": "/404.html",
    "pathLocale": "/",
    "extraFields": []
  }
]

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSearchIndex) {
    __VUE_HMR_RUNTIME__.updateSearchIndex(searchIndex)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ searchIndex }) => {
    __VUE_HMR_RUNTIME__.updateSearchIndex(searchIndex)
  })
}
