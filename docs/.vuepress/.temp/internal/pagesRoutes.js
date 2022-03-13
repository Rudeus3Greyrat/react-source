import { Vuepress } from '@vuepress/client/lib/components/Vuepress'

const routeItems = [
  ["v-8daa1a0e","/",{"title":"欢迎"},["/index.html","/README.md"]],
  ["v-040d6ab6","/entry/createRoot.html",{"title":""},["/entry/createRoot","/entry/createRoot.md"]],
  ["v-7c3b1a36","/entry/",{"title":"入口篇"},["/entry/index.html","/entry/index.md"]],
  ["v-0a40e9de","/get-started/",{"title":"简介"},["/get-started/index.html","/get-started/index.md"]],
  ["v-3706649a","/404.html",{"title":""},["/404"]],
  ["v-5f79c815","/entry/.~createRoot.html",{"title":""},["/entry/.~createRoot","/entry/.~createRoot.md"]],
]

export const pagesRoutes = routeItems.reduce(
  (result, [name, path, meta, redirects]) => {
    result.push(
      {
        name,
        path,
        component: Vuepress,
        meta,
      },
      ...redirects.map((item) => ({
        path: item,
        redirect: path,
      }))
    )
    return result
  },
  [
    {
      name: "404",
      path: "/:catchAll(.*)",
      component: Vuepress,
    }
  ]
)
