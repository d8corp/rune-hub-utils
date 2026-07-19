<h1 align="center">
<a href="https://github.com/d8corp/rune-hub">
<img src="https://cdn.jsdelivr.net/gh/d8corp/rune-hub@main/logo.svg" width="80">
</a>
<br>
@rune-hub/utils
</h1>

<div align="center">
  <a href="https://www.npmjs.com/package/@rune-hub/utils" target="_blank">
    <img src="https://img.shields.io/npm/v/@rune-hub/utils.svg" alt="rune-hub npm">
  </a>
  <a href="https://github.com/d8corp/rune-hub-utils" target="_blank">
    <img src="https://img.shields.io/badge/-GitHub-181717?logo=github&logoColor=white" alt="rune-hub source code">
  </a>
  <a href="https://www.npmtrends.com/@rune-hub/utils" target="_blank">
    <img src="https://img.shields.io/npm/dm/@rune-hub/utils.svg" alt="rune-hub downloads">
  </a>
  <a href="https://github.com/d8corp/rune-hub-utils/tree/main/release" target="_blank">
    <img src="https://packagephobia.com/badge?p=@rune-hub/utils" alt="rune-hub install size">
  </a>
  <a href="https://www.typescriptlang.org" target="_blank">
    <img src="https://img.shields.io/npm/types/@rune-hub/utils" alt="TypeScript">
  </a>
  <a href="https://github.com/d8corp/rune-hub-utils/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/npm/l/@rune-hub/utils" alt="rune-hub license">
  </a>
  <a href="https://github.com/d8corp/rune-hub-utils/blob/main/CHANGELOG.md" target="_blank">
    <img src="https://img.shields.io/badge/Changelog-⋮-brightgreen" alt="rune-hub changelog">
  </a>
  <a href="https://d8corp.github.io/rune-hub-utils/coverage/lcov-report" target="_blank">
    <img src="https://github.com/d8corp/rune-hub-utils/actions/workflows/tests.yml/badge.svg" alt="rune-hub tests">
  </a>
  <a href="https://github.com/d8corp/rune-hub-utils/issues" target="_blank">
    <img src="https://img.shields.io/github/issues-raw/d8corp/rune-hub-utils" alt="Open issues">
  </a>
  <a href="https://github.com/d8corp/rune-hub-utils/pulls" target="_blank">
    <img src="https://img.shields.io/github/issues-pr-raw/d8corp/rune-hub-utils" alt="Pull requests">
  </a>
</div>
<br>

`@rune-hub/utils` provides utility hooks for [rune-hub](https://www.npmjs.com/package/rune-hub) that simplify common patterns like persistent state management.
The library includes specialized hooks for browser storage synchronization with automatic encoding/decoding, cross-tab updates, and type-safe interfaces.

[![stars](https://img.shields.io/github/stars/d8corp/rune-hub-utils?style=social)](https://github.com/d8corp/rune-hub-utils/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/rune-hub-utils?style=social)](https://github.com/d8corp/rune-hub-utils/watchers)

## Index

<sup>**[ [Install](#install) ]**</sup>  
<sup>**[ [Hooks](#hooks) ]** [persistent](#persistent) • [persistentBool](#persistentbool) • [persistentNum](#persistentnum) • [persistentJSON](#persistentjson)</sup>  
<sup>**[ [Links](#links) ]**</sup>

## Install
###### [🏠︎](#index) / Install [↓](#hooks)

**Requires [rune-hub 1.0+](https://www.npmjs.com/package/rune-hub) as a peer dependency.**

These utilities are designed to work with rune-hub's reactive state management system.
Make sure to install both packages:

```shell
npm i rune-hub @rune-hub/utils
```

## Hooks
###### [🏠︎](#index) / Hooks [↑](#install) [↓](#links)

<sup>[persistent](#persistent) • [persistentBool](#persistentbool) • [persistentNum](#persistentnum) • [persistentJSON](#persistentjson)</sup>

### persistent
###### [🏠︎](#index) / [Hooks](#hooks) / persistent [↓](#persistentbool)

Creates a persistent [Rune](https://github.com/d8corp/rune-hub#rune) that synchronizes its state with browser storage (`localStorage` by default).

The Rune automatically loads the initial value from storage and saves changes back.
It also listens to `storage` and `pageshow` events to sync state across tabs and page navigations.

The simplest form accepts only a `key` parameter and works directly with string values.
The Rune returns `string | null`.
This approach provides direct one-to-one mapping between your state and storage:
if there's no value in storage, you get `null`, otherwise you get the exact string stored.
When you set the value to `null`, it clears the storage entry completely.

```ts
import { get, set } from 'rune-hub'
import { persistent } from '@rune-hub/utils'

const state = () => persistent('state')

console.log(get(state)) // null initially

set(state, 'foo')
console.log(get(state)) // 'foo'

set(state, null)
console.log(get(state)) // null (storage is clean)
```

When you provide an `initial` value, it serves as a fallback when storage is empty.
Note that passing `null` as the initial value works the same as omitting it entirely.

When you provide a string as the `initial` value, the Rune becomes strictly typed and returns `string` (not nullable).
In this mode, you cannot clear the state by setting it to the initial value — the storage will keep the entry with that value.
This is useful when you always want a valid string state without null checks.

```ts
const lang = () => persistent('lang', 'en')

console.log(get(lang)) // 'en' initially

set(lang, 'ru')
console.log(get(lang)) // 'ru'

set(lang, 'en')
console.log(get(lang)) // 'en' (storage is not clean)
```

This approach also allows you to safely change the default value in the future.
For example, if the default theme was initially `'dark'`, a user changed it to `'light'`, then back to `'dark'`.
Later, developers change the default to `'auto'` — users who manually selected `'dark'` will keep their choice because it's stored.
Only users who never changed this setting (no value in storage) will get the new `'auto'` default.

You can specify allowed state variants using generics to get type safety and autocomplete:

```ts
type Theme = 'dark' | 'light' | 'auto'
const theme = () => persistent<Theme>('search', 'auto')
```

By default, `persistent` uses `localStorage`, which persists data permanently across browser sessions and tabs.
You can use `sessionStorage` instead for temporary data that only exists within the current tab and is cleared when the tab closes.
Also, you can use simple/proxy object as storage, the storage changes by set or delete value (`storage[key] = value` or `delete storage[key]`).

```ts
const chatDraft = () => persistent('chatDraft', '', {
  storage: sessionStorage
})
```

When your state type is not `string | null`, you must provide `encode` and `decode` functions to convert between your type and string storage format.

The `encode` function converts your state value to a string (or `null` to clear storage), while `decode` converts the stored string back to your state type.

```ts
const isEnabled = () => persistent('isEnabled', false, {
  decode: v => v === '+',
  encode: v => v ? '+' : '-'
})

set(isEnabled, true)
console.log(localStorage.getItem('isEnabled')) // '+'
```

For `string | null` or `string` state types, you can optionally provide `encode` and `decode` to override the default conversion logic.
For example, you can make the state clear from storage when set back to the initial value:

```ts
const lang = () => persistent('lang', '', {
  encode: v => v ? v : null
})

set(lang, 'en')
console.log(localStorage.getItem('lang')) // 'en'

set(lang, '')
console.log(localStorage.getItem('lang')) // null (storage is clean)
```

### persistentBool
###### [🏠︎](#index) / [Hooks](#hooks) / persistentBool [↑](#persistent) [↓](#persistentnum)

Creates a persistent Rune for boolean values with convenient string encoding (`+` for true, `-` for false by default).

```ts
import { get, set } from 'rune-hub'
import { persistentBool } from '@rune-hub/utils'

const isDarkMode = () => persistentBool('darkMode', false)

console.log(get(isDarkMode)) // false
set(isDarkMode, true)
console.log(localStorage.getItem('darkMode')) // '+'
```

**With custom encoding:**

```ts
const isAccepted = () => persistentBool('accepted', false, {
  true: 'yes',
  false: 'no'
})

set(isAccepted, true)
console.log(localStorage.getItem('accepted')) // 'yes'
```

**With sessionStorage:**

```ts
const isExpanded = () => persistentBool('expanded', false, {
  storage: sessionStorage
})
```

**Nullable boolean:**

```ts
const consent = () => persistentBool('consent')

console.log(get(consent)) // null initially
set(consent, true)
set(consent, null) // Clears from storage
```

### persistentNum
###### [🏠︎](#index) / [Hooks](#hooks) / persistentNum [↑](#persistentbool) [↓](#persistentjson)

Creates a persistent Rune for numeric values with automatic number parsing.

```ts
import { get, set } from 'rune-hub'
import { persistentNum } from '@rune-hub/utils'

const count = () => persistentNum('count', 0)

console.log(get(count)) // 0
set(count, 42)
console.log(localStorage.getItem('count')) // '42'
```

**With sessionStorage:**

```ts
const tempCounter = () => persistentNum('counter', 0, {
  storage: sessionStorage
})
```

**Nullable number:**

```ts
const score = () => persistentNum('score')

console.log(get(score)) // null initially
set(score, 100)
set(score, null) // Clears from storage
```

### persistentJSON
###### [🏠︎](#index) / [Hooks](#hooks) / persistentJSON [↑](#persistentnum)

Creates a persistent Rune with automatic JSON serialization/deserialization for complex data structures.

```ts
import { get, set } from 'rune-hub'
import { persistentJSON } from '@rune-hub/utils'

interface User {
  name: string
  age: number
}

const user = () => persistentJSON<User>('user', { name: 'John', age: 30 })

console.log(get(user)) // { name: 'John', age: 30 }
set(user, { name: 'Jane', age: 25 })
console.log(localStorage.getItem('user')) // '{"name":"Jane","age":25}'
```

**With arrays:**

```ts
const items = () => persistentJSON<string[]>('items', [])

set(items, ['apple', 'banana', 'orange'])
console.log(get(items)) // ['apple', 'banana', 'orange']
```

**With sessionStorage:**

```ts
const tempData = () => persistentJSON<any>('data', null, {
  storage: sessionStorage
})
```

**Note:** Unlike other persistent hooks, `persistentJSON` stores `null` as `"null"` string in storage rather than clearing the entry.

## Links
###### [🏠︎](#index) / Links [↑](#hooks)

- **Creator**: [Mike Lysikov](http://github.com/d8corp)
- **Source Code**: [GitHub](https://github.com/d8corp/rune-hub-utils)
- **Repository**: [npm](https://www.npmjs.com/package/@rune-hub/utils) • [npmx](https://npmx.dev/package/@rune-hub/utils)
- **Core**: [rune-hub](https://github.com/d8corp/rune-hub)

**Contributions are welcome!** Please feel free to submit [issues](https://github.com/d8corp/rune-hub-utils/issues) and [pull requests](https://github.com/d8corp/rune-hub-utils/pulls).

[![issues](https://img.shields.io/github/issues-raw/d8corp/rune-hub-utils)](https://github.com/d8corp/rune-hub-utils/issues)
[![pulls](https://img.shields.io/github/issues-pr-raw/d8corp/rune-hub-utils)](https://github.com/d8corp/rune-hub-utils/pulls)
