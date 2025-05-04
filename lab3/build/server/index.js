import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, Outlet, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, createContext, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function Navbar() {
  return /* @__PURE__ */ jsxs("nav", { style: { padding: "1rem", background: "#eee" }, children: [
    /* @__PURE__ */ jsx(Link, { to: "/", style: { marginRight: "1rem" }, children: "Strona główna" }),
    /* @__PURE__ */ jsx(Link, { to: "/new", style: { marginRight: "1rem" }, children: "Dodaj książkę" }),
    /* @__PURE__ */ jsx("button", { style: { float: "right" }, children: "Login" })
  ] });
}
const BookContext = createContext();
const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([
    { id: 1, title: "Wiedźmin", author: "Andrzej Sapkowski" },
    { id: 2, title: "Lalka", author: "Bolesław Prus" },
    { id: 3, title: "Quo Vadis", author: "Henryk Sienkiewicz" }
  ]);
  const addBook = (book) => {
    setBooks([...books, { ...book, id: Date.now() }]);
  };
  const filterBooks = (query) => {
    const q = (query || "").toLowerCase().trim();
    if (!q) return books;
    return books.filter(
      (book) => book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q)
    );
  };
  return /* @__PURE__ */ jsx(BookContext.Provider, { value: { books, addBook, filterBooks }, children });
};
const useBooks = () => useContext(BookContext);
const root = withComponentProps(function Root() {
  return /* @__PURE__ */ jsxs(BookProvider, {
    children: [/* @__PURE__ */ jsx("meta", {
      charSet: "utf-8"
    }), /* @__PURE__ */ jsx(Navbar, {}), /* @__PURE__ */ jsxs("main", {
      style: {
        padding: "1rem"
      },
      children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
function BookList({ query }) {
  const { filterBooks } = useBooks();
  const filtered = filterBooks(query);
  if (filtered.length === 0) {
    return /* @__PURE__ */ jsxs("p", { children: [
      'Brak wyników dla: "',
      query,
      '"'
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { children: "Lista książek" }),
    /* @__PURE__ */ jsx("ul", { children: filtered.map((book) => /* @__PURE__ */ jsxs("li", { children: [
      /* @__PURE__ */ jsx("strong", { children: book.title }),
      " – ",
      book.author,
      /* @__PURE__ */ jsx("button", { disabled: true, style: { marginLeft: "1rem" }, children: "Edytuj" }),
      /* @__PURE__ */ jsx("button", { disabled: true, style: { marginLeft: "0.5rem" }, children: "Usuń" })
    ] }, book.id)) })
  ] });
}
const home = withComponentProps(function Home() {
  const [query, setQuery] = useState("");
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsx("h1", {
      children: "Wyszukiwarka książek"
    }), /* @__PURE__ */ jsx("input", {
      type: "text",
      placeholder: "Szukaj po tytule lub autorze...",
      value: query,
      onChange: (e) => {
        setQuery(e.target.value);
      },
      autoFocus: true,
      style: {
        marginBottom: "1rem",
        padding: "0.5rem",
        width: "100%"
      }
    }), /* @__PURE__ */ jsx(BookList, {
      query
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home
}, Symbol.toStringTag, { value: "Module" }));
function BookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const { addBook } = useBooks();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author) return;
    addBook({ title, author });
    navigate("/");
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { children: "Tytuł:" }),
      /* @__PURE__ */ jsx("input", { value: title, onChange: (e) => setTitle(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { children: "Autor:" }),
      /* @__PURE__ */ jsx("input", { value: author, onChange: (e) => setAuthor(e.target.value) })
    ] }),
    /* @__PURE__ */ jsx("button", { type: "submit", children: "Dodaj książkę" })
  ] });
}
const _new = withComponentProps(function NewBook() {
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsx("h1", {
      children: "Dodaj nową książkę"
    }), /* @__PURE__ */ jsx(BookForm, {})]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _new
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DOLHszVP.js", "imports": ["/assets/chunk-AYJ5UCUI-CtEJbUHs.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/root-BIYXAsI7.js", "imports": ["/assets/chunk-AYJ5UCUI-CtEJbUHs.js", "/assets/BookContext-D9p6sF8e.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": "/", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-Ab9fOZyK.js", "imports": ["/assets/BookContext-D9p6sF8e.js", "/assets/chunk-AYJ5UCUI-CtEJbUHs.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/new": { "id": "routes/new", "parentId": "root", "path": "/new", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/new-BL0WCdpU.js", "imports": ["/assets/BookContext-D9p6sF8e.js", "/assets/chunk-AYJ5UCUI-CtEJbUHs.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-5302a089.js", "version": "5302a089", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: "/",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/new": {
    id: "routes/new",
    parentId: "root",
    path: "/new",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routes,
  ssr
};
