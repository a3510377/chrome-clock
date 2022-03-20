var F = Object.defineProperty,
  j = Object.defineProperties;
var E = Object.getOwnPropertyDescriptors;
var D = Object.getOwnPropertySymbols;
var B = Object.prototype.hasOwnProperty,
  G = Object.prototype.propertyIsEnumerable;
var S = (o, e, t) =>
    e in o
      ? F(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
      : (o[e] = t),
  d = (o, e) => {
    for (var t in e || (e = {})) B.call(e, t) && S(o, t, e[t]);
    if (D) for (var t of D(e)) G.call(e, t) && S(o, t, e[t]);
    return o;
  },
  v = (o, e) => j(o, E(e));
import {
  a as g,
  c as M,
  u as A,
  d as y,
  b as x,
  r as k,
  w as P,
  o as C,
  e as h,
  f as _,
  F as T,
  g as O,
  h as V,
  i,
  t as m,
  j as K,
  k as U,
  l as L,
  m as q,
} from "./vendor.311f687c.js";
const R = function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) n(s);
  new MutationObserver((s) => {
    for (const a of s)
      if (a.type === "childList")
        for (const l of a.addedNodes)
          l.tagName === "LINK" && l.rel === "modulepreload" && n(l);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(s) {
    const a = {};
    return (
      s.integrity && (a.integrity = s.integrity),
      s.referrerpolicy && (a.referrerPolicy = s.referrerpolicy),
      s.crossorigin === "use-credentials"
        ? (a.credentials = "include")
        : s.crossorigin === "anonymous"
        ? (a.credentials = "omit")
        : (a.credentials = "same-origin"),
      a
    );
  }
  function n(s) {
    if (s.ep) return;
    s.ep = !0;
    const a = t(s);
    fetch(s.href, a);
  }
};
R();
const W = {},
  Y = {},
  z = { lave: {}, food: {} };
var I;
(function (o) {
  o.setConfig = "setConfig";
})(I || (I = {}));
const H = {
    [I.setConfig]: async ({ state: o }, e) => {
      if (
        ((e = Object.fromEntries(
          Object.entries(e).map(([t, n]) => [
            t,
            Object.fromEntries(
              Object.entries(n).map(([s, a]) => [s, a === null ? void 0 : a])
            ),
          ])
        )),
        (e.food.schoolName !== o.food.schoolName && e.food.schoolName) ||
          (e.food.schoolId !== o.food.schoolId && e.food.schoolId))
      ) {
        const { data: t } = await g({
          url: `https://fatraceschool.k12ea.gov.tw/school?SchoolName=${e.food.schoolName}`,
          method: "GET",
        });
        let { data: n } = t;
        e || (e = { food: {}, lave: {} }),
          console.log(n),
          n.length &&
            ((e.$_updata = !0),
            (e.food.schoolId = n[0].SchoolId.toString()),
            (e.food.schoolName = n[0].SchoolName));
      }
      e.$_updata !== !1 &&
        chrome.storage &&
        chrome.storage.local.set({ config: e }),
        (o.food = d(d({}, o.food), e.food)),
        (o.lave = d(d({}, o.lave), e.lave));
    },
  },
  J = { namespaced: !0, mutations: Y, getters: W, state: z, actions: H };
var $;
(function (o) {
  o.CONFIG = "config";
})($ || ($ = {}));
const Q = M({ modules: { [$.CONFIG]: J } }),
  b = Symbol("vue-store"),
  w = () => A(b);
const X = { key: 0, class: "menu" },
  Z = { class: "cover" },
  ee = ["src"],
  te = { class: "info flex flex-down flex-item-center" },
  oe = ["textContent"],
  se = ["textContent"],
  ne = y({
    setup(o) {
      const e = w(),
        t = x(() => e.state.config.food.schoolId),
        n = k();
      P(t, () => s()), C(() => clearInterval(a));
      const s = async () => {
          var u;
          let l = new Date();
          const { data: f } = await g({
            url: `https://fatraceschool.k12ea.gov.tw/offered/meal?SchoolId=${
              t.value
            }&period=${[l.getFullYear(), l.getMonth() + 1, l.getDate()].join(
              "-"
            )}&KitchenId=all`,
            method: "GET",
          });
          let c = (u = f == null ? void 0 : f.data) == null ? void 0 : u[0];
          if (c) {
            const { data: r } = await g({
              url: `https://fatraceschool.k12ea.gov.tw/dish?BatchDataId=${c.BatchDataId}`,
              method: "GET",
            });
            n.value = r == null ? void 0 : r.data;
          }
        },
        a = setInterval(s, 1e3 * 60 * 10);
      return (
        s(),
        (l, f) =>
          n.value
            ? (h(),
              _("div", X, [
                (h(!0),
                _(
                  T,
                  null,
                  O(
                    n.value,
                    (c, u) => (
                      h(),
                      _("div", { class: "dish", key: u }, [
                        i("div", Z, [
                          i(
                            "img",
                            {
                              src: `https://fatraceschool.k12ea.gov.tw/dish/pic/${c.DishId}`,
                              alt: "\u83DC\u8272\u5716\u7247",
                            },
                            null,
                            8,
                            ee
                          ),
                        ]),
                        i("div", te, [
                          i(
                            "span",
                            { textContent: m(c.DishType) },
                            null,
                            8,
                            oe
                          ),
                          i(
                            "span",
                            { textContent: m(c.DishName) },
                            null,
                            8,
                            se
                          ),
                        ]),
                      ])
                    )
                  ),
                  128
                )),
              ]))
            : V("", !0)
      );
    },
  });
var ae = (o, e) => {
  const t = o.__vccOpts || o;
  for (const [n, s] of e) t[n] = s;
  return t;
};
const ce = { class: "lave flex flex-item-center flex-center flex-down" },
  le = ["textContent"],
  re = { class: "flex" },
  ie = ["textContent"],
  ue = ["textContent"],
  de = y({
    setup(o) {
      const e = w(),
        t = x(() => e.state.config.lave.laveTime || 0),
        n = x(
          () =>
            e.state.config.lave.title || "\u6703\u8003\u5269\u9918\u5012\u6578"
        ),
        s = k(),
        a = ["\u5929", "\u5C0F\u6642", "\u5206\u9418", "\u79D2"],
        l = () => {
          let c =
            new Date(+t.value || "2022-05-21T00:00:00+08:00").getTime() -
            new Date().getTime();
          s.value = [
            c / (1e3 * 60 * 60 * 24),
            (c % (1e3 * 60 * 60 * 24)) / (1e3 * 60 * 60),
            (c % (1e3 * 60 * 60)) / (1e3 * 60),
            (c % (1e3 * 60)) / 1e3,
          ].map((r) => (~~r).toString().padStart(2, "0"));
          let u = s.value.map((r, p) => [p, +r]).filter(([, r]) => r !== 0)[0];
          document.title = `${n.value} ${u[1] || ""}${a[u[0]]}`;
        };
      l();
      const f = setInterval(l, 100);
      return (
        C(() => clearInterval(f)),
        (c, u) => (
          h(),
          _("div", ce, [
            i("div", { class: "title", textContent: m(K(n)) }, null, 8, le),
            i("div", re, [
              (h(),
              _(
                T,
                null,
                O(a, (r, p) => {
                  var N;
                  return i("div", { class: "flex", key: p }, [
                    i(
                      "span",
                      {
                        class: "time",
                        textContent: m((N = s.value) == null ? void 0 : N[p]),
                      },
                      null,
                      8,
                      ie
                    ),
                    i("span", { textContent: m(r) }, null, 8, ue),
                  ]);
                }),
                64
              )),
            ]),
          ])
        )
      );
    },
  });
var fe = ae(de, [["__scopeId", "data-v-6d97fc08"]]);
const he = { class: "wrapper" },
  _e = y({
    setup(o) {
      const e = w();
      return (
        U(() => {
          if (
            (console.log(e),
            chrome.storage && location.href.startsWith("chrome"))
          )
            chrome.storage.onChanged.addListener(async ({ config: t }) => {
              t &&
                (await e.dispatch(
                  "config/setConfig",
                  v(d({}, t), { $_updata: !1 })
                )),
                console.log(t);
            }),
              chrome.storage.local.get(["config"], ({ config: t }) => {
                console.log(t),
                  t &&
                    e.dispatch(
                      "config/setConfig",
                      v(d({}, t), { $_updata: !1 })
                    );
              });
          else {
            let t = new URL(location.href).searchParams;
            e.dispatch("config/setConfig", {
              lave: { title: t.get("laveTitle"), laveTime: t.get("laveTime") },
              food: {
                schoolId: t.get("foodSchoolId"),
                schoolName: t.get("foodSchoolName"),
              },
              $_updata: !1,
            });
          }
        }),
        C(() => {}),
        (t, n) => (h(), _("div", he, [L(fe), L(ne)]))
      );
    },
  });
q(_e).use(Q, b).mount("#app");
