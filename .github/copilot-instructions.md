## Svelte 5 Project!

This is a **SVELTE 5 PROJECT**. So you must use the new Svelte 5 syntax and features. DO NOT use Svelte 3 syntax.

So..

## FORBIDDEN

`export let foo` - prefer `let { foo } = $props`

`$: { ... }` - prefer `$derived(...)` or `$effect(...)`

`<slot>` - prefer `{#snippet } and @render`

## docs/kit/10-getting-started/10-introduction.md

# Introduction

## What is SvelteKit?

SvelteKit is a framework for rapidly developing robust, performant web applications using Svelte. Similar to Next.js (React) or Nuxt (Vue).

## What is Svelte?

Svelte is a way of writing UI components that compiles to JavaScript and CSS. The compiler converts components to optimized code that renders HTML and styles.

## SvelteKit vs Svelte

- **Svelte**: Renders UI components
- **SvelteKit**: Full-stack framework with routing, build optimizations, offline support, preloading, configurable rendering (SSR/CSR/prerendering), image optimization, and more

SvelteKit provides modern best practices and leverages Vite with HMR for fast development.

## docs/kit/10-getting-started/20-creating-a-project.md

# Creating a project

Start building a SvelteKit app:

```sh
npx sv create my-app
cd my-app
npm install
npm run dev
```

This scaffolds a project in `my-app`, installs dependencies, and starts a server on [localhost:5173](http://localhost:5173).

## Core concepts

- Each page is a [Svelte](../svelte) component
- Create pages by adding files to `src/routes` directory
- Pages are server-rendered first, then client-side app takes over

## Editor setup

Use [Visual Studio Code](https://code.visualstudio.com/download) with [the Svelte extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## docs/kit/10-getting-started/25-project-types.md

# Project Types

SvelteKit offers configurable rendering for different deployment scenarios. Rendering settings are not mutually exclusive - you can mix different approaches within the same app.

## Default Rendering

First page uses SSR, subsequent pages use CSR. This hybrid approach improves SEO and perceived performance while maintaining fast navigation.

## Static Site Generation

Use [`adapter-static`](adapter-static) for full prerendering or [prerender option](page-options#prerender) for selective static generation. For large sites, use [Incremental Static Regeneration with `adapter-vercel`](adapter-vercel#Incremental-Static-Regeneration).

## Single-Page App

Build SPAs with exclusive CSR. See [single-page apps guide](single-page-apps).

## Multi-Page App

Remove JavaScript with [`csr = false`](page-options#csr) or use [`data-sveltekit-reload`](link-options#data-sveltekit-reload) for server-rendered links.

## Separate Backend

Deploy frontend separately using `adapter-node` or serverless adapters. Skip `server` files documentation. See [FAQ for backend API calls](faq#How-do-I-use-a-different-backend-API-server).

## Serverless

Use [adapter-auto](adapter-auto) for zero-config deployment or platform-specific adapters: [`adapter-vercel`](adapter-vercel), [`adapter-netlify`](adapter-netlify), [`adapter-cloudflare`](adapter-cloudflare). Some offer `edge` option for [edge rendering](glossary#Edge).

## Your Own Server

Use [`adapter-node`](adapter-node) for VPS deployment.

## Container

Use [`adapter-node`](adapter-node) for Docker/LXC containers.

## Library

Create reusable libraries with [`@sveltejs/package`](packaging) using library option in [`sv create`](/docs/cli/sv-create).

## Offline App

Full [service workers](service-workers) support for offline apps and [PWAs](glossary#PWA).

## Mobile App

Convert SvelteKit SPA to mobile app with [Tauri](https://v2.tauri.app/start/frontend/sveltekit/) or [Capacitor](https://capacitorjs.com/solution/svelte). Use [`bundleStrategy: 'single'`](configuration#output) for HTTP/1 limitations.

## Desktop App

Convert SPA to desktop app with [Tauri](https://v2.tauri.app/start/frontend/sveltekit/), [Wails](https://wails.io/docs/guides/sveltekit/), or [Electron](https://www.electronjs.org/).

## Browser Extension

Use [`adapter-static`](adapter-static) or [community browser extension adapters](https://sveltesociety.dev/packages?category=sveltekit-adapters).

## Embedded Device

For low-power devices with connection limits, use [`bundleStrategy: 'single'`](configuration#output) to reduce concurrent requests.

## docs/kit/10-getting-started/30-project-structure.md

# Project structure

## Basic structure

```tree
my-project/
├ src/
│ ├ lib/
│ │ ├ server/
│ │ │ └ [server-only lib files]
│ │ └ [lib files]
│ ├ params/
│ │ └ [param matchers]
│ ├ routes/
│ │ └ [routes]
│ ├ app.html
│ ├ error.html
│ ├ hooks.client.js
│ ├ hooks.server.js
│ └ service-worker.js
├ static/
│ └ [static assets]
├ package.json
├ svelte.config.js
└ vite.config.js
```

## Key directories

### src/

- `lib/` - Library code, imported via `$lib` alias
- `lib/server/` - Server-only code, imported via `$lib/server` alias
- `params/` - Param matchers for routing
- `routes/` - Application routes
- `app.html` - Page template with placeholders:
  - `%sveltekit.head%` - Links, scripts, `<svelte:head>` content
  - `%sveltekit.body%` - Rendered page markup (wrap in `<div>`, not directly in `<body>`)
  - `%sveltekit.assets%` - Asset path
  - `%sveltekit.nonce%` - CSP nonce
  - `%sveltekit.env.[NAME]%` - Environment variables (must start with `publicPrefix`)
- `error.html` - Error page with `%sveltekit.status%` and `%sveltekit.error.message%`
- `hooks.client.js` / `hooks.server.js` - Client/server hooks
- `service-worker.js` - Service worker

### static/

Static assets served as-is (robots.txt, favicon.png, etc.)

## Config files

### package.json

Must include `@sveltejs/kit`, `svelte`, `vite` as `devDependencies`. Requires `"type": "module"`.

### svelte.config.js

Svelte and SvelteKit configuration.

### vite.config.js

Vite project using `@sveltejs/kit/vite` plugin.

### tsconfig.json

TypeScript config. SvelteKit generates `.svelte-kit/tsconfig.json` which your config extends.

## Generated files

### .svelte-kit/

Generated files (configurable as `outDir`). Can be deleted - regenerated on `dev`/`build`.

## docs/kit/10-getting-started/40-web-standards.md

# Web Standards

SvelteKit builds on standard [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) rather than reinventing them. These APIs work in all modern browsers and many non-browser environments.

## Fetch APIs

SvelteKit uses [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) for network requests. Available in hooks, server routes, and browsers.

> **Note:** Special `fetch` version in `load` functions, server hooks, and API routes invokes endpoints directly during SSR without HTTP calls while preserving credentials. Allows relative requests vs normal server-side `fetch` requiring fully qualified URLs.

### Request

[`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) accessible as `event.request` in hooks and server routes. Use `request.json()` and `request.formData()` for posted data.

### Response

[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) returned from `await fetch(...)` and `+server.js` handlers.

### Headers

[`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) interface for reading `request.headers` and setting `response.headers`:

```js
// @errors: 2461
/// file: src/routes/what-is-my-user-agent/+server.js
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET({ request }) {
	// log all headers
	console.log(...request.headers);

	// create a JSON Response using a header we received
	return json(
		{
			// retrieve a specific header
			userAgent: request.headers.get('user-agent')
		},
		{
			// set a header on the response
			headers: { 'x-custom-header': 'potato' }
		}
	);
}
```

## FormData

For HTML form submissions, use [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData):

```js
// @errors: 2461
/// file: src/routes/hello/+server.js
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const body = await event.request.formData();

	// log all fields
	console.log([...body]);

	return json({
		// get a specific field's value
		name: body.get('name') ?? 'world'
	});
}
```

## Stream APIs

For large or chunked responses, use [streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API): [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream), [WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream), [TransformStream](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream).

## URL APIs

[`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) interface with `origin`, `pathname` properties. Found in `event.url` (hooks/server routes), `page.url` (pages), `from`/`to` (navigation).

### URLSearchParams

Access query parameters via `url.searchParams` ([`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)):

```js
// @filename: ambient.d.ts
declare global {
	const url: URL;
}

export {};

// @filename: index.js
//cut
const foo = url.searchParams.get('foo');
```

## Web Crypto

[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) via `crypto` global. Used for CSP headers and UUID generation:

```js
const uuid = crypto.randomUUID();
```

## docs/kit/20-core-concepts/10-routing.md

# Routing

SvelteKit uses filesystem-based routing where directories define URL paths:

- `src/routes` → root route
- `src/routes/about` → `/about` route
- `src/routes/blog/[slug]` → route with parameter `slug`

**Key rules:**

- All files run on server
- All files run on client except `+server` files
- `+layout` and `+error` files apply to subdirectories

## +page

### +page.svelte

Defines a page component. Rendered on server (SSR) initially, then client (CSR) for navigation.

```svelte
<!file: src/routes/+page.svelte>
<h1>Hello and welcome to my site!</h1>
<a href="/about">About my site</a>
```

Pages receive data via `data` prop:

```svelte
<!file: src/routes/blog/[slug]/+page.svelte>
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

<h1>{data.title}</h1>
<div>{@html data.content}</div>
```

### +page.js

Exports `load` function to fetch data. Runs on server and client.

```js
/// file: src/routes/blog/[slug]/+page.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	if (params.slug === 'hello-world') {
		return {
			title: 'Hello world!',
			content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
		};
	}

	error(404, 'Not found');
}
```

Can export page options: `prerender`, `ssr`, `csr`.

### +page.server.js

Server-only `load` function for database access or private environment variables.

```js
/// file: src/routes/blog/[slug]/+page.server.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const post = await getPostFromDatabase(params.slug);

	if (post) {
		return post;
	}

	error(404, 'Not found');
}
```

Can also export actions for form handling.

## +error

Custom error pages. SvelteKit walks up the tree to find closest error boundary.

```svelte
<!file: src/routes/blog/[slug]/+error.svelte>
<script>
	import { page } from '$app/state';
</script>

<h1>{page.status}: {page.error.message}</h1>
```

## +layout

### +layout.svelte

Shared UI across pages. Must include `{@render children()}`.

```svelte
<!file: src/routes/+layout.svelte>
<script>
	let { children } = $props();
</script>

<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
	<a href="/settings">Settings</a>
</nav>

{@render children()}
```

Layouts can be nested and inherit from parent layouts.

### +layout.js

Provides data to layout and all child pages:

```js
/// file: src/routes/settings/+layout.js
/** @type {import('./$types').LayoutLoad} */
export function load() {
	return {
		sections: [
			{ slug: 'profile', title: 'Profile' },
			{ slug: 'notifications', title: 'Notifications' }
		]
	};
}
```

### +layout.server.js

Server-only layout load function. Change `LayoutLoad` to `LayoutServerLoad`.

## +server

API routes with HTTP verb handlers. Return `Response` objects.

```js
/// file: src/routes/api/random-number/+server.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
	const min = Number(url.searchParams.get('min') ?? '0');
	const max = Number(url.searchParams.get('max') ?? '1');

	const d = max - min;

	if (isNaN(d) || d < 0) {
		error(400, 'min and max must be numbers, and min must be less than max');
	}

	const random = min + Math.random() * d;

	return new Response(String(random));
}
```

### Receiving data

Handle POST/PUT/PATCH/DELETE requests:

```js
/// file: src/routes/api/add/+server.js
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { a, b } = await request.json();
	return json(a + b);
}
```

### Fallback handler

Handles unmatched HTTP methods:

```js
/** @type {import('./$types').RequestHandler} */
export async function fallback({ request }) {
	return text(`I caught your ${request.method} request!`);
}
```

### Content negotiation

Same directory can have `+page` and `+server`:

- `PUT`/`PATCH`/`DELETE`/`OPTIONS` → always `+server.js`
- `GET`/`POST`/`HEAD` → `+page` if `accept` header prioritizes `text/html`, else `+server.js`

## $types

SvelteKit generates TypeScript types in `$types.d.ts`:

```svelte
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>
```

Available types:

- `PageProps`, `LayoutProps` (Svelte 5)
- `PageLoad`, `PageServerLoad`
- `LayoutLoad`, `LayoutServerLoad`
- `RequestHandler`

## Other files

Non-route files in route directories are ignored. Use `$lib` for shared components.

## docs/kit/20-core-concepts/20-load.md

# Loading data

Before `+page.svelte` and `+layout.svelte` components render, get data using `load` functions.

## Page data

`+page.js` exports a `load` function, return value available via `data` prop:

```js
/// file: src/routes/blog/[slug]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	return {
		post: {
			title: `Title for ${params.slug} goes here`,
			content: `Content for ${params.slug} goes here`
		}
	};
}
```

```svelte
<!file: src/routes/blog/[slug]/+page.svelte>
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>
```

Server-only version using `+page.server.js`:

```js
/// file: src/routes/blog/[slug]/+page.server.js
import * as db from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		post: await db.getPost(params.slug)
	};
}
```

## Layout data

`+layout.js` or `+layout.server.js` load data for layouts:

```js
/// file: src/routes/blog/[slug]/+layout.server.js
import * as db from '$lib/server/database';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	return {
		posts: await db.getPostSummaries()
	};
}
```

```svelte
<!file: src/routes/blog/[slug]/+layout.svelte>
<script>
	/** @type {import('./$types').LayoutProps} */
	let { data, children } = $props();
</script>

<main>
	{@render children()}
</main>

<aside>
	<h2>More posts</h2>
	<ul>
		{#each data.posts as post}
			<li>
				<a href="/blog/{post.slug}">
					{post.title}
				</a>
			</li>
		{/each}
	</ul>
</aside>
```

Layout data is available to child layouts and pages. If multiple `load` functions return same key, last one wins.

## page.data

Parent layouts can access page data via `page.data`:

```svelte
<!file: src/routes/+layout.svelte>
<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.data.title}</title>
</svelte:head>
```

## Universal vs server

**Universal** (`+page.js`, `+layout.js`): Run on server during SSR, then in browser
**Server** (`+page.server.js`, `+layout.server.js`): Only run server-side

Server `load` runs first if both exist. Server `load` must return serializable data. Universal `load` can return custom classes/constructors.

Use server `load` for database access, private env vars. Use universal `load` for external APIs, non-serializable returns.

## Using URL data

Access URL properties in `load`:

```js
/// file: src/routes/a/[b]/[...c]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ route, params, url }) {
	console.log(route.id); // '/a/[b]/[...c]'
	// params: { "b": "x", "c": "y/z" } for /a/x/y/z
	// url: full URL object with searchParams, pathname, etc
}
```

## Making fetch requests

Use provided `fetch` function with enhanced features:

```js
/// file: src/routes/items/[id]/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const res = await fetch(`/api/items/${params.id}`);
	const item = await res.json();
	return { item };
}
```

- Inherits cookies/auth headers on server
- Relative requests work on server
- Internal requests go direct to handler
- Response inlined during SSR

## Cookies

Server `load` can get/set cookies:

```js
/// file: src/routes/+layout.server.js
import * as db from '$lib/server/database';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
	const sessionid = cookies.get('sessionid');
	return {
		user: await db.getUser(sessionid)
	};
}
```

## Headers

Set response headers with `setHeaders`:

```js
/// file: src/routes/products/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, setHeaders }) {
	const response = await fetch('https://cms.example.com/products.json');

	setHeaders({
		age: response.headers.get('age'),
		'cache-control': response.headers.get('cache-control')
	});

	return response.json();
}
```

## Using parent data

Access parent `load` data with `await parent()`:

```js
/// file: src/routes/+layout.js
/** @type {import('./$types').LayoutLoad} */
export function load() {
	return { a: 1 };
}
```

```js
/// file: src/routes/abc/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
	const { a } = await parent();
	return { c: a + 1 };
}
```

Avoid waterfalls - call independent functions before `await parent()`.

## Errors

Throw expected errors with `error` helper:

```js
/// file: src/routes/admin/+layout.server.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	if (!locals.user) {
		error(401, 'not logged in');
	}
}
```

## Redirects

Redirect with `redirect` helper:

```js
/// file: src/routes/user/+layout.server.js
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	if (!locals.user) {
		redirect(307, '/login');
	}
}
```

## Streaming with promises

Server `load` can return promises that stream to browser:

```js
/// file: src/routes/blog/[slug]/+page.server.js
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		comments: loadComments(params.slug), // streams
		post: await loadPost(params.slug) // awaited
	};
}
```

```svelte
<!file: src/routes/blog/[slug]/+page.svelte>
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

<h1>{data.post.title}</h1>

{#await data.comments}
	Loading comments...
{:then comments}
	{#each comments as comment}
		<p>{comment.content}</p>
	{/each}
{/await}
```

## Rerunning load functions

`load` functions rerun when dependencies change:

- `params` properties change
- `url` properties change
- `parent()` data changes
- Dependencies marked with `depends()` invalidated
- Manual `invalidate()` or `invalidateAll()` called

```js
/// file: src/routes/random-number/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, depends }) {
	const response = await fetch('https://api.example.com/random-number');
	depends('app:random');

	return {
		number: await response.json()
	};
}
```

Use `untrack()` to exclude from dependency tracking:

```js
/// file: src/routes/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ untrack, url }) {
	if (untrack(() => url.pathname === '/')) {
		return { message: 'Welcome!' };
	}
}
```

## Using getRequestEvent

Access request event in shared server logic:

```js
/// file: src/lib/server/auth.js
import { redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

export function requireLogin() {
	const { locals, url } = getRequestEvent();

	if (!locals.user) {
		redirect(307, `/login?redirectTo=${url.pathname}`);
	}

	return locals.user;
}
```

## docs/kit/20-core-concepts/30-form-actions.md

# Form actions

A `+page.server.js` file can export _actions_ for `POST` data using `<form>` elements. Client-side JavaScript is optional but enables progressive enhancement.

## Default actions

```js
/// file: src/routes/login/+page.server.js
/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		// TODO log the user in
	}
};
```

```svelte
<!file: src/routes/login/+page.svelte>
<form method="POST">
	<label>
		Email
		<input name="email" type="email">
	</label>
	<label>
		Password
		<input name="password" type="password">
	</label>
	<button>Log in</button>
</form>
```

Actions always use `POST` requests. Can invoke from other pages with `action` attribute:

```html
/// file: src/routes/+layout.svelte
<form method="POST" action="/login"></form>
```

## Named actions

```js
/// file: src/routes/login/+page.server.js
/** @satisfies {import('./$types').Actions} */
export const actions = {
	login: async (event) => {
		// TODO log the user in
	},
	register: async (event) => {
		// TODO register the user
	}
};
```

Invoke with query parameter prefixed by `/`:

```svelte
<!file: src/routes/login/+page.svelte>
<form method="POST" action="?/register">
```

Use `formaction` on buttons:

```svelte
/// file: src/routes/login/+page.svelte
<form method="POST" action="?/login">
	<button>Log in</button>
	<button formaction="?/register">Register</button>
</form>
```

> Can't have default actions next to named actions due to query parameter persistence.

## Anatomy of an action

Actions receive `RequestEvent` and can return data available through `form` prop:

```js
/// file: src/routes/login/+page.server.js
import * as db from '$lib/server/db';

/** @satisfies {import('./$types').Actions} */
export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		const user = await db.getUser(email);
		cookies.set('sessionid', await db.createSession(user), { path: '/' });

		return { success: true };
	}
};
```

```svelte
<!file: src/routes/login/+page.svelte>
<script>
	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();
</script>

{#if form?.success}
	<p>Successfully logged in! Welcome back, {data.user.name}</p>
{/if}
```

### Validation errors

Use `fail()` to return validation errors with HTTP status codes:

```js
/// file: src/routes/login/+page.server.js
import { fail } from '@sveltejs/kit';

/** @satisfies {import('./$types').Actions} */
export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email) {
			return fail(400, { email, missing: true });
		}

		const user = await db.getUser(email);

		if (!user || user.password !== db.hash(password)) {
			return fail(400, { email, incorrect: true });
		}

		cookies.set('sessionid', await db.createSession(user), { path: '/' });
		return { success: true };
	}
};
```

```svelte
/// file: src/routes/login/+page.svelte
<form method="POST" action="?/login">
	{#if form?.missing}<p class="error">The email field is required</p>{/if}
	{#if form?.incorrect}<p class="error">Invalid credentials!</p>{/if}
	<label>
		Email
		<input name="email" type="email" value={form?.email ?? ''} />
	</label>
	<label>
		Password
		<input name="password" type="password" />
	</label>
	<button>Log in</button>
</form>
```

### Redirects

```js
/// file: src/routes/login/+page.server.js
import { fail, redirect } from '@sveltejs/kit';

/** @satisfies {import('./$types').Actions} */
export const actions = {
	login: async ({ cookies, request, url }) => {
		// ... validation logic

		cookies.set('sessionid', await db.createSession(user), { path: '/' });

		if (url.searchParams.has('redirectTo')) {
			redirect(303, url.searchParams.get('redirectTo'));
		}

		return { success: true };
	}
};
```

## Loading data

Page re-renders after action runs. `load` functions run after action completes. Must update `event.locals` in actions if using in `handle`:

```js
/// file: src/routes/account/+page.server.js
/** @satisfies {import('./$types').Actions} */
export const actions = {
	logout: async (event) => {
		event.cookies.delete('sessionid', { path: '/' });
		event.locals.user = null;
	}
};
```

## Progressive enhancement

### use:enhance

```svelte
/// file: src/routes/login/+page.svelte
<script>
	import { enhance } from '$app/forms';
</script>

<form method="POST" use:enhance>
```

> Only works with `method="POST"` and actions in `+page.server.js`.

Default behavior:

- Updates `form` prop and `page.form`
- Resets form element
- Invalidates all data on success
- Handles redirects and errors
- Resets focus

### Customising use:enhance

```svelte
<form
	method="POST"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		// Pre-submission logic

		return async ({ result, update }) => {
			// Post-submission logic
		};
	}}
>
```

Use `applyAction` for custom behavior:

```svelte
/// file: src/routes/login/+page.svelte
<script>
	import { enhance, applyAction } from '$app/forms';
</script>

<form
	method="POST"
	use:enhance={({ formElement, formData, action, cancel }) => {
		return async ({ result }) => {
			if (result.type === 'redirect') {
				goto(result.location);
			} else {
				await applyAction(result);
			}
		};
	}}
>
```

### Custom event listener

```svelte
<!file: src/routes/login/+page.svelte>
<script>
	import { invalidateAll } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	/** @param {SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}} event */
	async function handleSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: data
		});

		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = deserialize(await response.text());

		if (result.type === 'success') {
			await invalidateAll();
		}

		applyAction(result);
	}
</script>

<form method="POST" onsubmit={handleSubmit}>

</form>
```

Use `x-sveltekit-action` header to POST to actions when `+server.js` exists:

```js
const response = await fetch(this.action, {
	method: 'POST',
	body: data,
	headers: {
		'x-sveltekit-action': 'true'
	}
});
```

## GET vs POST

Use `method="GET"` for forms that don't need to POST data (like search). These use client-side router:

```html
<form action="/search">
	<label>
		Search
		<input name="q" />
	</label>
</form>
```

Submits to `/search?q=...` and invokes load function but not actions. Supports `data-sveltekit-*` attributes like `<a>` elements.

## docs/kit/20-core-concepts/40-page-options.md

# Page Options

Control rendering behavior by exporting options from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`. Child layouts/pages override parent values.

## prerender

Generate static HTML at build time:

```js
/// file: +page.js/+page.server.js/+server.js
export const prerender = true;
```

Set in root layout to prerender everything, then opt-out specific pages:

```js
/// file: +page.js/+page.server.js/+server.js
export const prerender = false;
```

Include in manifest for dynamic SSR:

```js
/// file: +page.js/+page.server.js/+server.js
export const prerender = 'auto';
```

**Requirements:**

- All users must get same content from server
- No personalized data (use `onMount` for client-side personalization)
- Cannot access `url.searchParams` during prerendering
- Pages with actions cannot be prerendered

**Server routes:** Inherit prerender setting from pages that fetch from them.

**Route conflicts:** Use file extensions to avoid conflicts (`foo.json/+server.js` vs `foo/bar.json/+server.js`).

## entries

Define dynamic routes to prerender when they can't be discovered by crawling:

```js
/// file: src/routes/blog/[slug]/+page.server.js
/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return [{ slug: 'hello-world' }, { slug: 'another-blog-post' }];
}

export const prerender = true;
```

Can be `async` to fetch from CMS/database.

## ssr

Disable server-side rendering (renders empty shell):

```js
/// file: +page.js
export const ssr = false;
// If both `ssr` and `csr` are `false`, nothing will be rendered!
```

**Note:** Browser-only code must not run when module loads on server.

## csr

Disable client-side JavaScript:

```js
/// file: +page.js
export const csr = false;
```

**Effects:**

- No JavaScript shipped to client
- `<script>` tags removed from components
- No form progressive enhancement
- Full-page navigation for links
- No HMR

Enable during development:

```js
/// file: +page.js
import { dev } from '$app/environment';

export const csr = dev;
```

## trailingSlash

Control URL trailing slash behavior:

```js
/// file: src/routes/+layout.js
export const trailingSlash = 'always';
```

Options: `'never'` (default), `'always'`, `'ignore'`

Affects prerendering: `'always'` creates `about/index.html`, otherwise `about.html`.

## config

Adapter-specific deployment configuration:

```js
/// file: src/routes/+page.js
/** @type {import('some-adapter').Config} */
export const config = {
	runtime: 'edge'
};
```

Configs merge at top level only. Child configs override parent values but don't deep merge objects.

## docs/kit/20-core-concepts/50-state-management.md

# State Management

## Avoid shared state on the server

Servers are stateless and shared by multiple users. Never store data in shared variables:

```js
// @errors: 7034 7005
/// file: +page.server.js
let user;

/** @type {import('./$types').PageServerLoad} */
export function load() {
	return { user };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		// NEVER DO THIS!
		user = {
			name: data.get('name'),
			embarrassingSecret: data.get('secret')
		};
	}
};
```

Instead, authenticate users with cookies and persist data to a database.

## No side-effects in load

Load functions should be pure. Don't write to stores or global state:

```js
/// file: +page.js
// @filename: ambient.d.ts
declare module '$lib/user' {
	export const user: { set: (value: any) => void };
}

// @filename: index.js
//cut
import { user } from '$lib/user';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const response = await fetch('/api/user');

	// NEVER DO THIS!
	user.set(await response.json());
}
```

Instead, return the data:

```js
/// file: +page.js
/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	const response = await fetch('/api/user');

	return {
		user: await response.json()
	};
}
```

## Using state with context

Use Svelte's context API for shared state:

```svelte
<!file: src/routes/+layout.svelte>
<script>
	import { setContext } from 'svelte';

	/** @type {import('./$types').LayoutProps} */
	let { data } = $props();

	// Pass a function referencing our state
	// to the context for child components to access
	setContext('user', () => data.user);
</script>
```

```svelte
<!file: src/routes/user/+page.svelte>
<script>
	import { getContext } from 'svelte';

	// Retrieve user store from context
	const user = getContext('user');
</script>

<p>Welcome {user().name}</p>
```

> Pass functions to `setContext` to maintain reactivity. State updates during SSR won't affect parent components already rendered.

## Component state is preserved

Components are reused during navigation. Make values reactive:

```svelte
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	let wordCount = $derived(data.content.split(' ').length);
	let estimatedReadingTime = $derived(wordCount / 250);
</script>

/// file: src/routes/blog/[slug]/+page.svelte
```

To force component recreation:

```svelte
<script>
	import { page } from '$app/state';
</script>

{#key page.url.pathname}
	<BlogPost title={data.title} content={data.title} />
{/key}
```

## State storage patterns

- **URL search params**: For state that should survive reloads (`?sort=price&order=ascending`)
- **Snapshots**: For ephemeral UI state that should persist across navigation but not reloads

## docs/kit/20-core-concepts/60-remote-functions.md

# Remote Functions

<blockquote class="since note">
	<p>Available since 2.27</p>
</blockquote>

Type-safe client-server communication. Functions always run on server, can access server-only modules. Experimental feature requiring opt-in:

```js
/// file: svelte.config.js
export default {
	kit: {
		experimental: {
			remoteFunctions: true
		}
	}
};
```

## Overview

Export from `.remote.js`/`.remote.ts` files. Four types: `query`, `form`, `command`, `prerender`. Client calls become `fetch` wrappers to generated HTTP endpoints.

## query

Read dynamic data from server:

```js
/// file: src/routes/blog/data.remote.js
import { query } from '$app/server';
import * as db from '$lib/server/database';

export const getPosts = query(async () => {
	const posts = await db.sql`
		SELECT title, slug
		FROM post
		ORDER BY published_at
		DESC
	`;

	return posts;
});
```

Use with `await` in components:

```svelte
<!file: src/routes/blog/+page.svelte>
<script>
	import { getPosts } from './data.remote';
</script>

<h1>Recent posts</h1>

<ul>
	{#each await getPosts() as { title, slug }}
		<li><a href="/blog/{slug}">{title}</a></li>
	{/each}
</ul>
```

Alternative with `loading`/`error`/`current` properties:

```svelte
<!file: src/routes/blog/+page.svelte>
<script>
	import { getPosts } from './data.remote';

	const query = getPosts();
</script>

{#if query.error}
	<p>oops!</p>
{:else if query.loading}
	<p>loading...</p>
{:else}
	<ul>
		{#each query.current as { title, slug }}
			<li><a href="/blog/{slug}">{title}</a></li>
		{/each}
	</ul>
{/if}
```

### Query arguments

Validate arguments with Standard Schema (Zod, Valibot):

```js
/// file: src/routes/blog/data.remote.js
import * as v from 'valibot';
import { error } from '@sveltejs/kit';
import { query } from '$app/server';
import * as db from '$lib/server/database';

export const getPost = query(v.string(), async (slug) => {
	const [post] = await db.sql`
		SELECT * FROM post
		WHERE slug = ${slug}
	`;

	if (!post) error(404, 'Not found');
	return post;
});
```

### Refreshing queries

```svelte
<button onclick={() => getPosts().refresh()}> Check for new posts </button>
```

## form

Write data to server. Takes callback receiving `FormData`:

```ts
/// file: src/routes/blog/data.remote.js
import * as v from 'valibot';
import { error, redirect } from '@sveltejs/kit';
import { query, form } from '$app/server';
import * as db from '$lib/server/database';
import * as auth from '$lib/server/auth';

export const createPost = form(async (data) => {
	// Check the user is logged in
	const user = await auth.getUser();
	if (!user) error(401, 'Unauthorized');

	const title = data.get('title');
	const content = data.get('content');

	// Check the data is valid
	if (typeof title !== 'string' || typeof content !== 'string') {
		error(400, 'Title and content are required');
	}

	const slug = title.toLowerCase().replace(/ /g, '-');

	// Insert into the database
	await db.sql`
		INSERT INTO post (slug, title, content)
		VALUES (${slug}, ${title}, ${content})
	`;

	// Redirect to the newly created page
	redirect(303, `/blog/${slug}`);
});
```

Spread onto `<form>` element:

```svelte
<!file: src/routes/blog/new/+page.svelte>
<script>
	import { createPost } from '../data.remote';
</script>

<h1>Create a new post</h1>

<form {...createPost}>
	<label>
		<h2>Title</h2>
		<input name="title" />
	</label>

	<label>
		<h2>Write your post</h2>
		<textarea name="content"></textarea>
	</label>

	<button>Publish!</button>
</form>
```

### Single-flight mutations

Refresh specific queries instead of all queries. Server-side:

```js
export const createPost = form(async (data) => {
	// form logic goes here...

	// Refresh `getPosts()` on the server, and send
	// the data back with the result of `createPost`
	getPosts().refresh();

	// Redirect to the newly created page
	redirect(303, `/blog/${slug}`);
});
```

### Returns and redirects

Return data instead of redirecting:

```ts
/// file: src/routes/blog/data.remote.js
export const createPost = form(async (data) => {
	// ...

	return { success: true };
});
```

```svelte
<!file: src/routes/blog/new/+page.svelte>
<script>
	import { createPost } from '../data.remote';
</script>

<h1>Create a new post</h1>

<form {...createPost}></form>

{#if createPost.result?.success}
	<p>Successfully published!</p>
{/if}
```

### enhance

Customize form submission:

```svelte
<!file: src/routes/blog/new/+page.svelte>
<script>
	import { createPost } from '../data.remote';
	import { showToast } from '$lib/toast';
</script>

<h1>Create a new post</h1>

<form {...createPost.enhance(async ({ form, data, submit }) => {
	try {
		await submit();
		form.reset();

		showToast('Successfully published!');
	} catch (error) {
		showToast('Oh no! Something went wrong');
	}
})}>
	<input name="title" />
	<textarea name="content"></textarea>
	<button>publish</button>
</form>
```

Client-driven single-flight mutations:

```ts
await submit().updates(getPosts());
```

Optimistic updates:

```ts
await submit().updates(getPosts().withOverride((posts) => [newPost, ...posts]));
```

### buttonProps

Different form actions per button:

```svelte
<!file: src/routes/login/+page.svelte>
<script>
	import { login, register } from '$lib/auth';
</script>

<form {...login}>
	<label>
		Your username
		<input name="username" />
	</label>

	<label>
		Your password
		<input name="password" type="password" />
	</label>

	<button>login</button>
	<button {...register.buttonProps}>register</button>
</form>
```

## command

Write data from anywhere (not form-specific):

```ts
/// file: likes.remote.js
import * as v from 'valibot';
import { query, command } from '$app/server';
import * as db from '$lib/server/database';

export const getLikes = query(v.string(), async (id) => {
	const [row] = await db.sql`
		SELECT likes
		FROM item
		WHERE id = ${id}
	`;

	return row.likes;
});

export const addLike = command(v.string(), async (id) => {
	await db.sql`
		UPDATE item
		SET likes = likes + 1
		WHERE id = ${id}
	`;
});
```

Call from event handlers:

```svelte
<!file: +page.svelte>
<script>
	import { getLikes, addLike } from './likes.remote';
	import { showToast } from '$lib/toast';

	let { item } = $props();
</script>

<button
	onclick={async () => {
		try {
			await addLike(item.id);
		} catch (error) {
			showToast('Something went wrong!');
		}
	}}
>
	add like
</button>

<p>likes: {await getLikes(item.id)}</p>
```

### Single-flight mutations

Server-side refresh:

```js
export const addLike = command(v.string(), async (id) => {
	await db.sql`
		UPDATE item
		SET likes = likes + 1
		WHERE id = ${id}
	`;

	getLikes(id).refresh();
});
```

Client-side with optimistic updates:

```ts
try {
	await addLike(item.id).updates(getLikes(item.id).withOverride((n) => n + 1));
} catch (error) {
	showToast('Something went wrong!');
}
```

## prerender

Build-time data fetching for static data:

```js
/// file: src/routes/blog/data.remote.js
import { prerender } from '$app/server';
import * as db from '$lib/server/database';

export const getPosts = prerender(async () => {
	const posts = await db.sql`
		SELECT title, slug
		FROM post
		ORDER BY published_at
		DESC
	`;

	return posts;
});
```

### Prerender arguments

With validation and inputs:

```js
/// file: src/routes/blog/data.remote.js
import * as v from 'valibot';
import { error } from '@sveltejs/kit';
import { prerender } from '$app/server';
import * as db from '$lib/server/database';

export const getPost = prerender(
	v.string(),
	async (slug) => {
		const [post] = await db.sql`
			SELECT * FROM post
			WHERE slug = ${slug}
		`;

		if (!post) error(404, 'Not found');
		return post;
	},
	{
		inputs: () => ['first-post', 'second-post', 'third-post']
	}
);
```

Allow dynamic calls:

```js
export const getPost = prerender(
	v.string(),
	async (slug) => {
		/* ... */
	},
	{
		dynamic: true,
		inputs: () => ['first-post', 'second-post', 'third-post']
	}
);
```

## Handling validation errors

Custom validation error handling:

```js
/// file: src/hooks.server.ts
/** @type {import('@sveltejs/kit').HandleValidationError} */
export function handleValidationError({ event, issues }) {
	return {
		message: 'Nice try, hacker!'
	};
}
```

Skip validation (unsafe):

```ts
/// file: data.remote.ts
import { query } from '$app/server';

export const getStuff = query('unchecked', async ({ id }: { id: string }) => {
	// the shape might not actually be what TypeScript thinks
	// since bad actors might call this function with other arguments
});
```

## Using `getRequestEvent`

Access request context:

```ts
/// file: user.remote.ts
import { getRequestEvent, query } from '$app/server';
import { findUser } from '$lib/server/database';

export const getProfile = query(async () => {
	const user = await getUser();

	return {
		name: user.name,
		avatar: user.avatar
	};
});

// this function could be called from multiple places
function getUser() {
	const { cookies, locals } = getRequestEvent();

	locals.userPromise ??= findUser(cookies.get('session_id'));
	return await locals.userPromise;
}
```

## Redirects

Use `redirect()` in `query`, `form`, `prerender` functions. Not available in `command` functions.

## docs/kit/25-build-and-deploy/10-building-your-app.md

# Building your app

Building happens in two stages when running `vite build`:

1. Vite creates optimized production build of server code, browser code, and service worker. Prerendering executes here.
2. An _adapter_ tunes the build for your target environment.

## During the build

SvelteKit loads `+page/layout(.server).js` files for analysis during build. Code that shouldn't execute at build time must check `building` from `$app/environment`:

```js
import { building } from '$app/environment';
import { setupMyDatabase } from '$lib/server/database';

if (!building) {
	setupMyDatabase();
}

export function load() {
	// ...
}
```

## Preview your app

View production build locally with `vite preview`. Runs in Node, so adapter-specific features like `platform` object don't apply to previews.

## docs/kit/25-build-and-deploy/20-adapters.md

# Adapters

Adapters are plugins that prepare your SvelteKit app for deployment to specific platforms.

## Official Adapters

- `@sveltejs/adapter-cloudflare` - Cloudflare Workers/Pages
- `@sveltejs/adapter-netlify` - Netlify
- `@sveltejs/adapter-node` - Node servers
- `@sveltejs/adapter-static` - Static site generation (SSG)
- `@sveltejs/adapter-vercel` - Vercel

[Community adapters](https://sveltesociety.dev/packages?category=sveltekit-adapters) available for other platforms.

## Usage

Configure in `svelte.config.js`:

```js
/// file: svelte.config.js
// @filename: ambient.d.ts
declare module 'svelte-adapter-foo' {
	const adapter: (opts: any) => import('@sveltejs/kit').Adapter;
	export default adapter;
}

// @filename: index.js
//cut
import adapter from 'svelte-adapter-foo';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// adapter options go here
		})
	}
};

export default config;
```

## Platform Context

Adapters may provide platform-specific data (e.g., Cloudflare KV namespaces) via the `platform` property in `RequestEvent` for hooks and server routes. Check adapter documentation for details.

## docs/kit/25-build-and-deploy/55-single-page-apps.md

# Single-page apps

Turn any SvelteKit app into a client-rendered SPA by disabling SSR:

```js
/// file: src/routes/+layout.js
export const ssr = false;
```

> [!NOTE] Not recommended: harms SEO, slows perceived performance, breaks accessibility when JavaScript fails.

## Usage with adapter-static

For apps without server-side logic, use `adapter-static` with a fallback page:

```js
// @errors: 2307
/// file: svelte.config.js
import adapter from '@sveltejs/adapter-static';

export default {
	kit: {
		adapter: adapter({
			fallback: '200.html' // may differ from host to host
		})
	}
};
```

The fallback page loads your app and navigates to the correct route. Common names: `200.html`, `index.html` - check your host's documentation.

## Apache

Add `static/.htaccess` for Apache hosting:

```
<IfModule mod_rewrite.c>
	RewriteEngine On
	RewriteBase /
	RewriteRule ^200\.html$ - [L]
	RewriteCond %{REQUEST_FILENAME} !-f
	RewriteCond %{REQUEST_FILENAME} !-d
	RewriteRule . /200.html [L]
</IfModule>
```

## Prerendering individual pages

Re-enable SSR for specific pages:

```js
/// file: src/routes/my-prerendered-page/+page.js
export const prerender = true;
export const ssr = true;
```

## docs/kit/30-advanced/10-advanced-routing.md

# Advanced routing

## Rest parameters

Use rest syntax for unknown number of route segments:

```sh
/[org]/[repo]/tree/[branch]/[...file]
```

Request `/sveltejs/kit/tree/main/documentation/docs/04-advanced-routing.md` results in:

```js
// @noErrors
{
	org: 'sveltejs',
	repo: 'kit',
	branch: 'main',
	file: 'documentation/docs/04-advanced-routing.md'
}
```

> `[...rest]` matches empty paths too. Always validate the parameter value.

### 404 pages

Create custom 404s with rest parameters:

```tree
src/routes/
├ marx-brothers/
| ├ [...path]/
│ ├ chico/
│ ├ harpo/
│ ├ groucho/
│ └ +error.svelte
└ +error.svelte
```

```js
/// file: src/routes/marx-brothers/[...path]/+page.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load(event) {
	error(404, 'Not Found');
}
```

## Optional parameters

Make parameters optional with double brackets: `[[lang]]/home` matches both `home` and `en/home`.

> Optional parameters cannot follow rest parameters.

## Matching

Validate route parameters with matchers:

```js
/// file: src/params/fruit.js
/**
 * @param {string} param
 * @return {param is ('apple' | 'orange')}
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export function match(param) {
	return param === 'apple' || param === 'orange';
}
```

Use in routes: `src/routes/fruits/[page=fruit]`

## Sorting

Route priority (highest to lowest):

- More specific routes
- Parameters with matchers `[name=type]` over `[name]`
- `[[optional]]` and `[...rest]` have lowest priority
- Alphabetical for ties

## Encoding

Use hex escape sequences for special characters:

- `/` — `[x+2f]`
- `:` — `[x+3a]`
- `*` — `[x+2a]`
- `?` — `[x+3f]`
- `#` — `[x+23]`
- `%` — `[x+25]`

Example: `/smileys/:-)` becomes `src/routes/smileys/[x+3a]-[x+29]/+page.svelte`

Unicode escapes also work: `[u+d83e][u+dd2a]` or `🤪`

## Advanced layouts

### (group)

Group routes without affecting URLs:

```tree
src/routes/
│ (app)/
│ ├ dashboard/
│ ├ item/
│ └ +layout.svelte
│ (marketing)/
│ ├ about/
│ ├ testimonials/
│ └ +layout.svelte
├ admin/
└ +layout.svelte
```

### +page@

Break out of layout hierarchy:

- `+page@[id].svelte` - inherits from `[id]/+layout.svelte`
- `+page@item.svelte` - inherits from `item/+layout.svelte`
- `+page@.svelte` - inherits from root layout

### +layout@

Layouts can also break out of their hierarchy using `@` syntax.

### Alternatives

Use composition instead of complex grouping:

```svelte
<!file: src/routes/nested/route/+layout@.svelte>
<script>
	import ReusableLayout from '$lib/ReusableLayout.svelte';
	let { data, children } = $props();
</script>

<ReusableLayout {data}>
	{@render children()}
</ReusableLayout>
```

```js
/// file: src/routes/nested/route/+layout.js
import { reusableLoad } from '$lib/reusable-load-function';

/** @type {import('./$types').PageLoad} */
export function load(event) {
	// Add additional logic here, if needed
	return reusableLoad(event);
}
```

## docs/kit/30-advanced/20-hooks.md

# Hooks

App-wide functions that SvelteKit calls in response to specific events.

Three optional hook files:

- `src/hooks.server.js` — server hooks
- `src/hooks.client.js` — client hooks
- `src/hooks.js` — universal hooks (both client and server)

Code runs when the application starts up, useful for initializing database clients.

## Server hooks

### handle

Runs on every server request. Receives `event` and `resolve` function.

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/custom')) {
		return new Response('custom response');
	}

	const response = await resolve(event);
	return response;
}
```

Default: `({ event, resolve }) => resolve(event)`

#### locals

Add custom data to `event.locals` for handlers and server `load` functions:

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	event.locals.user = await getUserInformation(event.cookies.get('sessionid'));

	const response = await resolve(event);
	response.headers.set('x-custom-header', 'potato');

	return response;
}
```

#### resolve options

Second parameter to `resolve()`:

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('old', 'new'),
		filterSerializedResponseHeaders: (name) => name.startsWith('x-'),
		preload: ({ type, path }) => type === 'js' || path.includes('/important/')
	});

	return response;
}
```

### handleFetch

Modify `event.fetch` calls on server/during prerendering:

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ request, fetch }) {
	if (request.url.startsWith('https://api.yourapp.com/')) {
		request = new Request(
			request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),
			request
		);
	}

	return fetch(request);
}
```

For sibling subdomains, manually include cookies:

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ event, request, fetch }) {
	if (request.url.startsWith('https://api.my-domain.com/')) {
		request.headers.set('cookie', event.request.headers.get('cookie'));
	}

	return fetch(request);
}
```

### handleValidationError

Called when remote function validation fails:

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit').HandleValidationError} */
export function handleValidationError({ issues }) {
	return {
		message: 'No thank you'
	};
}
```

## Shared hooks

Available in both `src/hooks.server.js` and `src/hooks.client.js`:

### handleError

Handle unexpected errors. Log errors and return safe user representation:

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error, event, status, message }) {
	const errorId = crypto.randomUUID();

	Sentry.captureException(error, {
		extra: { event, errorId, status }
	});

	return {
		message: 'Whoops!',
		errorId
	};
}
```

Customize error shape via `App.Error` interface:

```ts
/// file: src/app.d.ts
declare global {
	namespace App {
		interface Error {
			message: string;
			errorId: string;
		}
	}
}
```

### init

Runs once when server starts or app starts in browser:

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit').ServerInit} */
export async function init() {
	await db.connect();
}
```

## Universal hooks

In `src/hooks.js`, run on both server and client:

### reroute

Change URL-to-route translation before `handle`:

```js
/// file: src/hooks.js
/** @type {Record<string, string>} */
const translated = {
	'/en/about': '/en/about',
	'/de/ueber-uns': '/de/about',
	'/fr/a-propos': '/fr/about'
};

/** @type {import('@sveltejs/kit').Reroute} */
export function reroute({ url }) {
	if (url.pathname in translated) {
		return translated[url.pathname];
	}
}
```

Can be async (since v2.18):

```js
/// file: src/hooks.js
/** @type {import('@sveltejs/kit').Reroute} */
export async function reroute({ url, fetch }) {
	if (url.pathname === '/api/reroute') return;

	const api = new URL('/api/reroute', url);
	api.searchParams.set('pathname', url.pathname);

	const result = await fetch(api).then((r) => r.json());
	return result.pathname;
}
```

### transport

Pass custom types across server/client boundary:

```js
/// file: src/hooks.js
/** @type {import('@sveltejs/kit').Transport} */
export const transport = {
	Vector: {
		encode: (value) => value instanceof Vector && [value.x, value.y],
		decode: ([x, y]) => new Vector(x, y)
	}
};
```

## docs/kit/30-advanced/25-errors.md

# Errors

SvelteKit handles expected and unexpected errors differently. Both are represented as `{ message: string }` objects by default.

## Expected errors

Created with the `error` helper from `@sveltejs/kit`:

```js
/// file: src/routes/blog/[slug]/+page.server.js
import { error } from '@sveltejs/kit';
import * as db from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const post = await db.getPost(params.slug);

	if (!post) {
		error(404, {
			message: 'Not found'
		});
	}

	return { post };
}
```

This sets the response status and renders the nearest `+error.svelte` component:

```svelte
<!file: src/routes/+error.svelte>
<script>
	import { page } from '$app/state';
</script>

<h1>{page.error.message}</h1>
```

Add extra properties:

```js
error(404, {
	message: 'Not found',
	code: 'NOT_FOUND'
});
```

Or use string shorthand:

```js
error(404, 'Not found');
```

## Unexpected errors

Any other exception during request handling. Default shape:

```json
{ "message": "Internal Error" }
```

Go through the `handleError` hook for custom handling.

## Responses

- Errors in `handle` or `+server.js`: fallback error page or JSON based on `Accept` headers
- Errors in `load`: renders nearest `+error.svelte` component
- Root layout errors: uses fallback error page

Customize fallback with `src/error.html`:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>%sveltekit.error.message%</title>
	</head>
	<body>
		<h1>My custom error page</h1>
		<p>Status: %sveltekit.status%</p>
		<p>Message: %sveltekit.error.message%</p>
	</body>
</html>
```

## Type safety

Customize error shape with `App.Error` interface:

```ts
/// file: src/app.d.ts
declare global {
	namespace App {
		interface Error {
			code: string;
			id: string;
		}
	}
}

export {};
```

Always includes `message: string` property.

## docs/kit/30-advanced/30-link-options.md

# Link options

SvelteKit uses `<a>` elements for navigation. Customize link behavior with `data-sveltekit-*` attributes on the link or parent element. These also apply to `<form>` elements with `method="GET"`.

## data-sveltekit-preload-data

Preloads page data on hover/touch before click occurs.

- `"hover"` - preload on mouse hover (desktop) or touchstart (mobile)
- `"tap"` - preload on touchstart/mousedown only

```html
<body data-sveltekit-preload-data="hover">
	<div style="display: contents">%sveltekit.body%</div>
</body>
```

```html
<a data-sveltekit-preload-data="tap" href="/stonks"> Get current stonk values </a>
```

Ignored when `navigator.connection.saveData` is `true`.

## data-sveltekit-preload-code

Preloads page code only. Four values by eagerness:

- `"eager"` - preload immediately
- `"viewport"` - preload when entering viewport
- `"hover"` - preload on hover/touch
- `"tap"` - preload on touchstart/mousedown

`viewport` and `eager` only work for links present immediately after navigation.

## data-sveltekit-reload

Forces full-page navigation instead of SvelteKit handling.

```html
<a data-sveltekit-reload href="/path">Path</a>
```

Links with `rel="external"` get same treatment and are ignored during prerendering.

## data-sveltekit-replacestate

Replaces current history entry instead of creating new one.

```html
<a data-sveltekit-replacestate href="/path">Path</a>
```

## data-sveltekit-keepfocus

Prevents focus reset after navigation.

```html
<form data-sveltekit-keepfocus>
	<input type="text" name="query" />
</form>
```

Avoid on links. Only use on elements that exist after navigation.

## data-sveltekit-noscroll

Prevents scroll to top (0,0) after navigation.

```html
<a href="path" data-sveltekit-noscroll>Path</a>
```

## Disabling options

Use `"false"` value to disable inherited options:

```html
<div data-sveltekit-preload-data>
	<a href="/a">a</a>
	<a href="/b">b</a>
	<a href="/c">c</a>

	<div data-sveltekit-preload-data="false">
		<a href="/d">d</a>
		<a href="/e">e</a>
		<a href="/f">f</a>
	</div>
</div>
```

Conditional attributes:

```svelte
<div data-sveltekit-preload-data={condition ? 'hover' : false}>
```

## docs/kit/30-advanced/40-service-workers.md

# Service workers

Service workers act as proxy servers handling network requests. Enable offline support and speed up navigation by precaching built JS/CSS.

## Setup

Create `src/service-worker.js` (or `src/service-worker/index.js`) - it's automatically bundled and registered.

Default registration:

```js
if ('serviceWorker' in navigator) {
	addEventListener('load', function () {
		navigator.serviceWorker.register('./path/to/service-worker.js');
	});
}
```

## $service-worker module

Access paths to static assets, build files, prerendered pages, app version, and base path.

Example - cache app eagerly, other requests on-demand:

```js
// @errors: 2339
/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files // everything in `static`
];

self.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);

			if (response) {
				return response;
			}
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			// if we're offline, fetch can return a value that is not a Response
			// instead of throwing - and we can't pass this non-Response to respondWith
			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			// if there's no cache, then just error out
			// as there is nothing we can do to respond to this request
			throw err;
		}
	}

	event.respondWith(respond());
});
```

**Gotcha:** Be careful caching large assets - browsers empty caches when full.

## Development

Service worker bundled for production only. For manual registration in dev:

```js
import { dev } from '$app/environment';

navigator.serviceWorker.register('/service-worker.js', {
	type: dev ? 'module' : 'classic'
});
```

**Note:** `build` and `prerendered` are empty arrays in development.

## Type safety

Add to top of `service-worker.js`:

```original-js
/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));
```

```generated-ts
/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;
```

Use `sw` instead of `self`. For `$env/static/public` imports, add `/// <reference types="../.svelte-kit/ambient.d.ts" />`.

## docs/kit/30-advanced/50-server-only-modules.md

# Server-only modules

SvelteKit prevents accidental import of sensitive data into frontend code through server-only modules.

## Private environment variables

`$env/static/private` and `$env/dynamic/private` modules can only be imported in server-only modules like `hooks.server.js` or `+page.server.js`.

## Server-only utilities

`$app/server` module (contains `read` function for filesystem access) can only be imported by server code.

## Your modules

Make modules server-only by:

- Adding `.server` to filename: `secrets.server.js`
- Placing in `$lib/server`: `$lib/server/secrets.js`

## How it works

SvelteKit errors on any import chain from public code to server-only code:

```js
/// file: $lib/server/secrets.js
export const atlantisCoordinates = [
	/* redacted */
];
```

```js
/// file: src/routes/utils.js
export { atlantisCoordinates } from '$lib/server/secrets.js';
export const add = (a, b) => a + b;
```

```html
/// file: src/routes/+page.svelte
<script>
	import { add } from './utils.js';
</script>
```

Error:

```
Cannot import $lib/server/secrets.js into public-facing code:
src/routes/+page.svelte
	src/routes/utils.js
		$lib/server/secrets.js
```

Even though only `add` is used, the entire import chain is unsafe.

Works with dynamic imports, including interpolated ones like ``await import(`./${foo}.js`)``.

> **Note:** Detection disabled when `process.env.TEST === 'true'` for testing frameworks like Vitest.

## docs/kit/30-advanced/65-snapshots.md

# Snapshots

Preserves ephemeral DOM state (scroll positions, input values) when navigating between pages.

## Basic Usage

Export a `snapshot` object with `capture` and `restore` methods from `+page.svelte` or `+layout.svelte`:

```svelte
<!file: +page.svelte>
<script>
	let comment = $state('');

	/** @type {import('./$types').Snapshot<string>} */
	export const snapshot = {
		capture: () => comment,
		restore: (value) => comment = value
	};
</script>

<form method="POST">
	<label for="comment">Comment</label>
	<textarea id="comment" bind:value={comment} />
	<button>Post comment</button>
</form>
```

## How it Works

- `capture` called before page updates, value stored in browser history
- `restore` called with stored value when navigating back
- Data persisted to `sessionStorage` (survives page reloads)

## Requirements

- Data must be JSON serializable
- Avoid large objects (memory/storage limitations)

## docs/kit/30-advanced/67-shallow-routing.md

# Shallow routing

Create history entries without navigating using `pushState` and `replaceState`. Useful for modals that users can dismiss by navigating back.

## Basic usage

```svelte
<!file: +page.svelte>
<script>
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import Modal from './Modal.svelte';

	function showModal() {
		pushState('', {
			showModal: true
		});
	}
</script>

{#if page.state.showModal}
	<Modal close={() => history.back()} />
{/if}
```

## API

- `pushState(url, state)` - Creates new history entry
- `replaceState(url, state)` - Updates current history entry
- First argument: URL relative to current (use `''` to stay on current URL)
- Second argument: Page state accessible via `page.state`
- Type-safe with `App.PageState` interface in `src/app.d.ts`

## Loading data for routes

Use `preloadData` to load data for another route without navigating:

```svelte
<!file: src/routes/photos/+page.svelte>
<script>
	import { preloadData, pushState, goto } from '$app/navigation';
	import { page } from '$app/state';
	import Modal from './Modal.svelte';
	import PhotoPage from './[id]/+page.svelte';

	let { data } = $props();
</script>

{#each data.thumbnails as thumbnail}
	<a
		href="/photos/{thumbnail.id}"
		onclick={async (e) => {
			if (innerWidth < 640        // bail if the screen is too small
				|| e.shiftKey             // or the link is opened in a new window
				|| e.metaKey || e.ctrlKey // or a new tab (mac: metaKey, win/linux: ctrlKey)
				// should also consider clicking with a mouse scroll wheel
			) return;

			// prevent navigation
			e.preventDefault();

			const { href } = e.currentTarget;

			// run `load` functions (or rather, get the result of the `load` functions
			// that are already running because of `data-sveltekit-preload-data`)
			const result = await preloadData(href);

			if (result.type === 'loaded' && result.status === 200) {
				pushState(href, { selected: result.data });
			} else {
				// something bad happened! try navigating
				goto(href);
			}
		}}
	>
		<img alt={thumbnail.alt} src={thumbnail.src} />
	</a>
{/each}

{#if page.state.selected}
	<Modal onclose={() => history.back()}>

		<PhotoPage data={page.state.selected} />
	</Modal>
{/if}
```

## Caveats

- `page.state` is empty during SSR and on first page load
- Requires JavaScript - provide fallback behavior
- State lost on page reload

## docs/kit/40-best-practices/03-auth.md

# Auth

Authentication verifies user identity via credentials. Authorization determines allowed actions.

## Sessions vs Tokens

**Sessions**: Store ID in database, can be immediately revoked, requires DB query per request.

**JWT**: Not checked against datastore, cannot be immediately revoked, better latency and reduced DB load.

## Integration

Check auth [cookies](cookies) in [server hooks](hooks#Server-hooks). Store user info in [`locals`](hooks#Server-hooks-locals) when credentials match.

## Implementation

[Lucia](https://lucia-auth.com/) provides SvelteKit-specific session-based auth examples.

Add to projects:

- New: `npx sv create`
- Existing: `npx sv add lucia`

Use SvelteKit-specific guides rather than generic JS auth libraries to avoid multiple framework dependencies.

## docs/kit/40-best-practices/06-icons.md

# Icons

## CSS

Use Iconify for [popular icon sets](https://icon-sets.iconify.design/) via [CSS](https://iconify.design/docs/usage/css/). Works with [Tailwind CSS plugin](https://iconify.design/docs/usage/css/tailwind/) or [UnoCSS plugin](https://iconify.design/docs/usage/css/unocss/). No imports needed in `.svelte` files.

## Svelte

Choose [icon libraries](https://www.sveltesociety.dev/packages?category=icons) carefully. Avoid libraries with one `.svelte` file per icon - thousands of files slow down [Vite's dependency optimization](https://vite.dev/guide/dep-pre-bundling.html). Especially problematic with mixed umbrella and subpath imports ([vite-plugin-svelte FAQ](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#what-is-going-on-with-vite-and-pre-bundling-dependencies)).

## docs/kit/40-best-practices/07-images.md

# Images

Images impact app performance. Optimize by generating formats like `.avif`/`.webp`, creating different sizes for screens, and ensuring effective caching.

## Vite's Built-in Handling

Vite automatically processes imported assets, adds hashes for caching, and inlines small assets.

```svelte
<script>
	import logo from '$lib/assets/logo.png';
</script>

<img alt="The project logo" src={logo} />
```

## @sveltejs/enhanced-img

Plugin providing automatic image optimization: smaller formats, intrinsic dimensions, multiple sizes, EXIF stripping. Only works with build-time accessible files.

### Setup

```sh
npm install --save-dev @sveltejs/enhanced-img
```

```js
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		enhancedImages(), // must come before SvelteKit
		sveltekit()
	]
});
```

### Basic Usage

```svelte
<enhanced:img src="./path/to/your/image.jpg" alt="An alt text" />
```

Generates `<picture>` with multiple formats/sizes. Provide 2x resolution images - smaller versions auto-generated.

### Dynamic Images

```svelte
<script>
	import MyImage from './path/to/your/image.jpg?enhanced';
</script>

<enhanced:img src={MyImage} alt="some alt text" />
```

With `import.meta.glob`:

```svelte
<script>
	const imageModules = import.meta.glob(
		'/path/to/assets/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}',
		{
			eager: true,
			query: {
				enhanced: true
			}
		}
	);
</script>

{#each Object.entries(imageModules) as [_path, module]}
	<enhanced:img src={module.default} alt="some alt text" />
{/each}
```

### Dimensions & Sizing

`width`/`height` auto-inferred to prevent layout shift. Override with CSS:

```svelte
<style>
	.hero-image img {
		width: var(--size);
		height: auto;
	}
</style>
```

For large images, specify `sizes`:

```svelte
<enhanced:img src="./image.png" sizes="min(1280px, 100vw)" />
```

Custom widths:

```svelte
<enhanced:img
	src="./image.png?w=1280;640;400"
	sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
/>
```

### Per-image Transforms

```svelte
<enhanced:img src="./path/to/your/image.jpg?blur=15" alt="An alt text" />
```

## CDN Images

For dynamic images not available at build time. Use libraries like `@unpic/svelte` or CDN-specific solutions (Cloudinary, etc.).

## Best Practices

- Mix solutions as needed per image type
- Serve via CDN for reduced latency
- Use 2x resolution originals for HiDPI displays
- Specify `sizes` for large images (>400px width)
- Set `fetchpriority="high"` for LCP images, avoid `loading="lazy"`
- Constrain images to prevent layout shift
- Always provide `alt` text
- Don't modify `em`/`rem` defaults when using in `sizes`

## docs/kit/40-best-practices/20-seo.md

# SEO

## Out of the box

### SSR

SvelteKit uses SSR by default for better search engine indexing. Don't disable it in [`handle`](hooks#Server-hooks-handle) unless necessary.

### Performance

[Core Web Vitals](https://web.dev/vitals/#core-web-vitals) impact search rankings. Test with [PageSpeed Insights](https://pagespeed.web.dev/) or [Lighthouse](https://developers.google.com/web/tools/lighthouse).

### Normalized URLs

SvelteKit redirects trailing slashes based on [configuration](page-options#trailingSlash) to avoid duplicate URLs.

## Manual setup

### &lt;title&gt; and &lt;meta&gt;

Add unique `<title>` and `<meta name="description">` in [`<svelte:head>`](../svelte/svelte-head). Common pattern: return SEO data from [`load`](load) functions, use as [`page.data`]($app-state) in root layout.

### Sitemaps

Create dynamic sitemaps with endpoints:

```js
/// file: src/routes/sitemap.xml/+server.js
export async function GET() {
	return new Response(
		`
		<?xml version="1.0" encoding="UTF-8" ?>
		<urlset
			xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="https://www.w3.org/1999/xhtml"
			xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
		>
			
		</urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}
```

### AMP

For [AMP](https://amp.dev/) support:

1. Set [`inlineStyleThreshold`](configuration#inlineStyleThreshold):

```js
/// file: svelte.config.js
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// since <link rel="stylesheet"> isn't
		// allowed, inline all styles
		inlineStyleThreshold: Infinity
	}
};

export default config;
```

2. Disable CSR:

```js
/// file: src/routes/+layout.server.js
export const csr = false;
```

3. Add `amp` to `app.html`:

```html
<html amp>
	...
</html>
```

4. Transform HTML with `@sveltejs/amp`:

```js
/// file: src/hooks.server.js
import * as amp from '@sveltejs/amp';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	let buffer = '';
	return await resolve(event, {
		transformPageChunk: ({ html, done }) => {
			buffer += html;
			if (done) return amp.transform(buffer);
		}
	});
}
```

5. Optional: Remove unused CSS with [`dropcss`](https://www.npmjs.com/package/dropcss):

```js
/// file: src/hooks.server.js
import * as amp from '@sveltejs/amp';
import dropcss from 'dropcss';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	let buffer = '';

	return await resolve(event, {
		transformPageChunk: ({ html, done }) => {
			buffer += html;

			if (done) {
				let css = '';
				const markup = amp
					.transform(buffer)
					.replace('⚡', 'amp') // dropcss can't handle this character
					.replace(/<style amp-custom([^>]*?)>([^]+?)<\/style>/, (match, attributes, contents) => {
						css = contents;
						return `<style amp-custom${attributes}></style>`;
					});

				css = dropcss({ css, html: markup }).css;
				return markup.replace('</style>', `${css}</style>`);
			}
		}
	});
}
```

> Validate transformed HTML with `amphtml-validator` only during prerendering (it's slow).

Instructions for LLMs: <s>Always use Svelte 5 runes and Svelte 5 syntax. Runes do not need to be imported, they are globals. $state() runes are always declared using `let`, never with `const`. When passing a function to $derived, you must always use $derived.by(() => ...). Error boundaries can only catch errors during component rendering and at the top level of an $effect inside the error boundary. Error boundaries do not catch errors in onclick or other event handlers.</s>
