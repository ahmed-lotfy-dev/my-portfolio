# 🚀 Modern JavaScript/TypeScript Features (2024-2025)
## لو لسه بتكتب كود زي ما كنت بتكتب في 2022، حرام عليك!

> هذا الدليل الشامل يغطي أحدث features في JavaScript و TypeScript اللي لازم تستخدمها النهارده.
> كل section فيه شرح نظري + أمثلة عملية + use cases حقيقية.

---

## 📑 Table of Contents

1. [Iterator Helpers](#1-iterator-helpers-)
2. [Set Methods (Union, Intersection, Difference)](#2-set-methods-)
3. [RegExp.escape()](#3-regexpescape-)
4. [Promise.try()](#4-promisetry-)
5. [Import JSON Directly](#5-import-json-directly-)
6. [Float16 (Half-Precision)](#6-float16-half-precision-)
7. [Pipeline Operator](#7-pipeline-operator-)
8. [Object.groupBy() & Map.groupBy()](#8-objectgroupby--mapgroupby-)
9. [Pattern Matching](#9-pattern-matching-)
10. [Temporal API](#10-temporal-api-)

---

## 1. Iterator Helpers 🔄

### المشكلة القديمة (2022 Style)

```javascript
// ❌ الطريقة القديمة - كنا بنحول لـ Array الأول
const users = new Map([
  ['1', { name: 'Ahmed', age: 25, active: true }],
  ['2', { name: 'Mohamed', age: 30, active: false }],
  ['3', { name: 'Sara', age: 22, active: true }],
]);

// لازم نحول لـ Array عشان نستخدم map/filter
const activeUserNames = [...users.values()]
  .filter(user => user.active)
  .map(user => user.name);

// المشكلة: بنعمل Array جديد في كل step = memory waste
```

### الحل الجديد (2024+ Style)

```javascript
// ✅ Iterator Helpers - شغالين على الـ Iterator مباشرة
const activeUserNames = users.values()
  .filter(user => user.active)
  .map(user => user.name)
  .toArray();

// لاحظ: مفيش [...] في كل step - الـ evaluation بيحصل lazy
```

### كل الـ Iterator Helpers المتاحة

```javascript
// 1. map() - Transform كل element
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.values()
  .map(n => n * 2)
  .toArray(); // [2, 4, 6, 8, 10]

// 2. filter() - اختار elements معينة
const evens = numbers.values()
  .filter(n => n % 2 === 0)
  .toArray(); // [2, 4]

// 3. take(n) - خد أول n elements
const firstThree = numbers.values()
  .take(3)
  .toArray(); // [1, 2, 3]

// 4. drop(n) - اتجاهل أول n elements
const afterTwo = numbers.values()
  .drop(2)
  .toArray(); // [3, 4, 5]

// 5. flatMap() - map + flatten
const nested = [[1, 2], [3, 4]];
const flat = nested.values()
  .flatMap(arr => arr)
  .toArray(); // [1, 2, 3, 4]

// 6. some() - هل في element واحد على الأقل بيحقق الشرط؟
const hasEven = numbers.values()
  .some(n => n % 2 === 0); // true

// 7. every() - هل كل الـ elements بتحقق الشرط؟
const allPositive = numbers.values()
  .every(n => n > 0); // true

// 8. find() - أول element بيحقق الشرط
const firstEven = numbers.values()
  .find(n => n % 2 === 0); // 2

// 9. reduce() - اجمع كل الـ elements في قيمة واحدة
const sum = numbers.values()
  .reduce((acc, n) => acc + n, 0); // 15

// 10. forEach() - نفذ action على كل element
numbers.values()
  .forEach(n => console.log(n));

// 11. toArray() - حول لـ Array
const arr = numbers.values().toArray();
```

### Real-World Example: Paginated API Data Processing

```javascript
// Scenario: عندك API بترجع data كـ AsyncIterator
async function* fetchUsers(pageSize = 100) {
  let page = 1;
  while (true) {
    const response = await fetch(`/api/users?page=${page}&limit=${pageSize}`);
    const users = await response.json();
    if (users.length === 0) break;
    yield* users;
    page++;
  }
}

// ❌ Old way - load everything in memory
const allActiveUsers = [];
for await (const user of fetchUsers()) {
  if (user.active && user.role === 'admin') {
    allActiveUsers.push(user.email);
  }
  if (allActiveUsers.length >= 10) break;
}

// ✅ New way - lazy evaluation
const first10AdminEmails = await Array.fromAsync(
  fetchUsers()
    .filter(user => user.active && user.role === 'admin')
    .map(user => user.email)
    .take(10)
);
```

### React/React Native Use Case

```tsx
// في React component - process large lists efficiently
function UserList({ users }: { users: Map<string, User> }) {
  // Lazy processing - مش هنعمل Array جديد في كل render
  const activeUserCards = users.values()
    .filter(user => user.isActive)
    .take(20) // للـ virtualization
    .map(user => <UserCard key={user.id} user={user} />)
    .toArray();

  return <div className="user-list">{activeUserCards}</div>;
}
```

---

## 2. Set Methods 🎯

### المشكلة القديمة

```javascript
// ❌ 2022 Style - manual implementation
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// Union - كنا لازم نعملها manual
const union = new Set([...setA, ...setB]);

// Intersection - أصعب
const intersection = new Set([...setA].filter(x => setB.has(x)));

// Difference
const difference = new Set([...setA].filter(x => !setB.has(x)));
```

### الحل الجديد (2024+)

```javascript
// ✅ Built-in Set methods
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// 1. union() - كل الـ elements من الـ two sets
const union = setA.union(setB);
// Set(6) { 1, 2, 3, 4, 5, 6 }

// 2. intersection() - الـ elements المشتركة بس
const intersection = setA.intersection(setB);
// Set(2) { 3, 4 }

// 3. difference() - elements في A بس مش في B
const difference = setA.difference(setB);
// Set(2) { 1, 2 }

// 4. symmetricDifference() - elements في واحد بس مش الاتنين
const symDiff = setA.symmetricDifference(setB);
// Set(4) { 1, 2, 5, 6 }

// 5. isSubsetOf() - هل A subset من B?
const isSubset = new Set([3, 4]).isSubsetOf(setA);
// true

// 6. isSupersetOf() - هل A superset لـ B?
const isSuperset = setA.isSupersetOf(new Set([3, 4]));
// true

// 7. isDisjointFrom() - هل مفيش elements مشتركة؟
const isDisjoint = setA.isDisjointFrom(new Set([7, 8]));
// true
```

### Real-World Example: Permission System

```typescript
// Scenario: Role-based access control
interface Role {
  name: string;
  permissions: Set<string>;
}

const adminRole: Role = {
  name: 'admin',
  permissions: new Set(['read', 'write', 'delete', 'manage_users', 'view_analytics']),
};

const editorRole: Role = {
  name: 'editor',
  permissions: new Set(['read', 'write', 'publish']),
};

const viewerRole: Role = {
  name: 'viewer',
  permissions: new Set(['read']),
};

// User has multiple roles
function getUserPermissions(roles: Role[]): Set<string> {
  // ❌ Old way
  // return new Set(roles.flatMap(r => [...r.permissions]));
  
  // ✅ New way - clean and expressive
  return roles.reduce(
    (acc, role) => acc.union(role.permissions),
    new Set<string>()
  );
}

// Check if user has all required permissions
function hasAllPermissions(
  userPermissions: Set<string>,
  required: Set<string>
): boolean {
  // ❌ Old way
  // return [...required].every(p => userPermissions.has(p));
  
  // ✅ New way
  return required.isSubsetOf(userPermissions);
}

// Get missing permissions
function getMissingPermissions(
  userPermissions: Set<string>,
  required: Set<string>
): Set<string> {
  // ❌ Old way
  // return new Set([...required].filter(p => !userPermissions.has(p)));
  
  // ✅ New way
  return required.difference(userPermissions);
}

// Usage
const user = { roles: [editorRole, viewerRole] };
const userPerms = getUserPermissions(user.roles);
const requiredPerms = new Set(['read', 'write', 'delete']);

console.log(hasAllPermissions(userPerms, requiredPerms)); // false
console.log(getMissingPermissions(userPerms, requiredPerms)); // Set { 'delete' }
```

### React Use Case: Tag Selection Component

```tsx
function TagSelector({ 
  availableTags,
  selectedTags,
  suggestedTags,
  onSelectionChange 
}: {
  availableTags: Set<string>;
  selectedTags: Set<string>;
  suggestedTags: Set<string>;
  onSelectionChange: (tags: Set<string>) => void;
}) {
  // Tags that are suggested but not yet selected
  const unselectedSuggestions = suggestedTags.difference(selectedTags);
  
  // Tags available for selection (not already selected)
  const selectableTags = availableTags.difference(selectedTags);
  
  // Check if any suggested tags are selected
  const hasSuggestedSelection = !suggestedTags.isDisjointFrom(selectedTags);

  const handleToggleTag = (tag: string) => {
    const newSelection = selectedTags.has(tag)
      ? selectedTags.difference(new Set([tag]))
      : selectedTags.union(new Set([tag]));
    onSelectionChange(newSelection);
  };

  const handleSelectAllSuggested = () => {
    onSelectionChange(selectedTags.union(suggestedTags));
  };

  return (
    <div>
      {unselectedSuggestions.size > 0 && (
        <button onClick={handleSelectAllSuggested}>
          Select All Suggested ({unselectedSuggestions.size})
        </button>
      )}
      {/* ... rest of UI */}
    </div>
  );
}
```

---

## 3. RegExp.escape() 🛡️

### المشكلة القديمة

```javascript
// ❌ Manual escaping - error-prone!
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const userInput = "Hello (World)! How are you?";
const pattern = new RegExp(escapeRegExp(userInput));

// المشكلة: ممكن ننسى character، أو الـ function يكون فيها bug
// دي security vulnerability محتملة!
```

### الحل الجديد

```javascript
// ✅ Built-in - secure and correct
const userInput = "Hello (World)! How are you?";
const escaped = RegExp.escape(userInput);
// "Hello \\(World\\)! How are you\\?"

const pattern = new RegExp(escaped);
// Safe to use with any user input
```

### Real-World Example: Search Highlighting

```typescript
// Scenario: Highlight search terms in text
function highlightSearchTerms(
  text: string,
  searchTerms: string[]
): string {
  if (searchTerms.length === 0) return text;

  // ❌ Old way - vulnerable to regex injection
  // const pattern = new RegExp(`(${searchTerms.join('|')})`, 'gi');
  
  // ✅ New way - safe
  const escapedTerms = searchTerms.map(term => RegExp.escape(term));
  const pattern = new RegExp(`(${escapedTerms.join('|')})`, 'gi');

  return text.replace(pattern, '<mark>$1</mark>');
}

// Usage
const article = "React (and React Native) are great for building UIs!";
const query = "(and React Native)"; // User input with regex special chars

const highlighted = highlightSearchTerms(article, [query]);
// "React <mark>(and React Native)</mark> are great for building UIs!"
```

### React Component for Safe Search

```tsx
function SearchHighlight({ 
  text, 
  searchQuery 
}: { 
  text: string; 
  searchQuery: string;
}) {
  if (!searchQuery.trim()) {
    return <span>{text}</span>;
  }

  const escaped = RegExp.escape(searchQuery);
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === searchQuery.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
```

---

## 4. Promise.try() 🎯

### المشكلة القديمة

```javascript
// ❌ Inconsistent error handling
function mayThrowSync() {
  if (Math.random() > 0.5) {
    throw new Error('Sync error!');
  }
  return 'success';
}

async function mayThrowAsync() {
  if (Math.random() > 0.5) {
    throw new Error('Async error!');
  }
  return 'success';
}

// الـ sync error مش هيتـ catch!
Promise.resolve()
  .then(() => mayThrowSync())
  .catch(err => console.log('Caught:', err)); // قد لا يعمل!

// لازم نعمل workaround
Promise.resolve()
  .then(() => {
    return mayThrowSync(); // Wrapped
  })
  .catch(err => console.log('Caught:', err));
```

### الحل الجديد

```javascript
// ✅ Promise.try() - يـ handle sync و async errors
Promise.try(() => mayThrowSync())
  .catch(err => console.log('Caught:', err)); // Always works!

Promise.try(() => mayThrowAsync())
  .catch(err => console.log('Caught:', err)); // Also works!

// مع arguments
Promise.try(someFunction, arg1, arg2)
  .then(result => console.log(result))
  .catch(err => console.error(err));
```

### Real-World Example: Unified Data Fetching

```typescript
// Scenario: Function might return cached data (sync) or fetch (async)
class DataService {
  private cache = new Map<string, unknown>();

  getData(key: string, fetcher: () => Promise<unknown> | unknown) {
    // ❌ Old way - complex handling
    // try {
    //   const cached = this.cache.get(key);
    //   if (cached) return Promise.resolve(cached);
    //   const result = fetcher();
    //   return Promise.resolve(result).then(data => {
    //     this.cache.set(key, data);
    //     return data;
    //   });
    // } catch (err) {
    //   return Promise.reject(err);
    // }

    // ✅ New way - clean and consistent
    return Promise.try(() => {
      const cached = this.cache.get(key);
      if (cached) return cached;

      const result = fetcher();
      return result;
    }).then(data => {
      this.cache.set(key, data);
      return data;
    });
  }
}

// Usage
const service = new DataService();

// Works with sync functions
service.getData('config', () => JSON.parse(localStorage.getItem('config')!))
  .then(config => console.log(config))
  .catch(err => console.error('Parse error:', err)); // Catches JSON.parse errors!

// Works with async functions
service.getData('users', async () => {
  const res = await fetch('/api/users');
  return res.json();
}).then(users => console.log(users));
```

### React Hook for Safe Async Operations

```tsx
function useSafeAsync<T>() {
  const [state, setState] = useState<{
    data: T | null;
    error: Error | null;
    loading: boolean;
  }>({ data: null, error: null, loading: false });

  const execute = useCallback((fn: () => T | Promise<T>) => {
    setState({ data: null, error: null, loading: true });

    // ✅ Promise.try handles both sync and async errors
    Promise.try(fn)
      .then(data => setState({ data, error: null, loading: false }))
      .catch(error => setState({ data: null, error, loading: false }));
  }, []);

  return { ...state, execute };
}

// Usage
function MyComponent() {
  const { data, error, loading, execute } = useSafeAsync<User>();

  const handleLoadUser = (id: string) => {
    execute(() => {
      // This might throw synchronously (validation) or asynchronously (fetch)
      if (!id) throw new Error('ID is required');
      return fetchUser(id);
    });
  };

  // ...
}
```

---

## 5. Import JSON Directly 📄

### المشكلة القديمة

```javascript
// ❌ Old hacks for importing JSON

// Hack 1: require (CommonJS only)
const config = require('./config.json');

// Hack 2: fetch at runtime
const config = await fetch('./config.json').then(r => r.json());

// Hack 3: TypeScript resolveJsonModule
// Needs tsconfig: "resolveJsonModule": true
import config from './config.json';

// Hack 4: Dynamic import with assertion (old syntax)
const config = await import('./config.json', { assert: { type: 'json' } });
```

### الحل الجديد (Import Attributes)

```javascript
// ✅ Standard way - Import Attributes (ES2025)
import config from './config.json' with { type: 'json' };

// Dynamic import
const config = await import('./config.json', { with: { type: 'json' } });

// Named exports from JSON
import { version, name } from './package.json' with { type: 'json' };

console.log(version); // "1.0.0"
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true
  }
}
```

### Real-World Example: i18n with JSON

```typescript
// locales/en.json
{
  "welcome": "Welcome, {{name}}!",
  "errors": {
    "notFound": "Resource not found",
    "unauthorized": "Please log in"
  }
}

// i18n.ts
import en from './locales/en.json' with { type: 'json' };
import ar from './locales/ar.json' with { type: 'json' };

type Locale = typeof en;
type LocaleKey = keyof typeof en;

const locales: Record<string, Locale> = { en, ar };

function t(key: string, params?: Record<string, string>): string {
  const currentLocale = locales[getCurrentLanguage()] ?? en;
  let value = key.split('.').reduce((obj, k) => obj?.[k], currentLocale as any);
  
  if (typeof value !== 'string') return key;
  
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      value = value.replace(`{{${k}}}`, v);
    });
  }
  
  return value;
}

// Usage
console.log(t('welcome', { name: 'Ahmed' })); // "Welcome, Ahmed!"
console.log(t('errors.notFound')); // "Resource not found"
```

### Config Management Pattern

```typescript
// config/default.json
{
  "api": {
    "baseUrl": "https://api.example.com",
    "timeout": 5000
  },
  "features": {
    "darkMode": true,
    "analytics": false
  }
}

// config/index.ts
import defaultConfig from './default.json' with { type: 'json' };

// Type-safe configuration
type Config = typeof defaultConfig;

// Merge with environment-specific overrides
const envConfig: Partial<Config> = {
  api: {
    ...defaultConfig.api,
    baseUrl: process.env.API_URL ?? defaultConfig.api.baseUrl,
  },
};

export const config: Config = {
  ...defaultConfig,
  ...envConfig,
};

// Usage anywhere in the app
import { config } from '@/config';
console.log(config.api.baseUrl);
```

---

## 6. Float16 (Half-Precision) 🔢

### ليه Float16 مهم؟

```javascript
// Float16 = 16-bit floating point
// - نص الـ memory من Float32
// - مثالي للـ ML models, graphics, و large datasets
// - دقة أقل بس كافية لـ use cases كتير
```

### الـ API الجديد

```javascript
// ✅ Float16Array - مثل Float32Array بس نص الـ size
const float16Array = new Float16Array([1.5, 2.5, 3.5]);
console.log(float16Array.BYTES_PER_ELEMENT); // 2 (vs 4 for Float32)

// Math.f16round() - round لـ Float16 precision
const precise = 3.14159265359;
const f16 = Math.f16round(precise);
console.log(f16); // 3.140625 (limited precision)

// DataView methods
const buffer = new ArrayBuffer(4);
const view = new DataView(buffer);

view.setFloat16(0, 3.14, true); // little-endian
console.log(view.getFloat16(0, true)); // 3.140625
```

### Real-World Example: ML Model Weights

```typescript
// Scenario: Loading ML model weights efficiently
class ModelWeights {
  private weights: Float16Array;

  constructor(size: number) {
    // ❌ Old way - Full precision, more memory
    // this.weights = new Float32Array(size);
    // Memory: size * 4 bytes

    // ✅ New way - Half precision, half memory
    this.weights = new Float16Array(size);
    // Memory: size * 2 bytes
  }

  async loadFromServer(url: string): Promise<void> {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    // Weights stored as Float16 on server = smaller download
    this.weights = new Float16Array(buffer);
  }

  // Matrix multiplication with Float16
  multiply(input: Float16Array): Float16Array {
    const result = new Float16Array(this.weights.length);
    for (let i = 0; i < result.length; i++) {
      // JavaScript automatically handles Float16 math
      result[i] = this.weights[i] * input[i % input.length];
    }
    return result;
  }
}

// Memory savings example
const modelSize = 10_000_000; // 10 million weights
const oldMemory = modelSize * 4; // 40 MB with Float32
const newMemory = modelSize * 2; // 20 MB with Float16
console.log(`Memory saved: ${(oldMemory - newMemory) / 1024 / 1024} MB`);
// "Memory saved: 20 MB"
```

### WebGL/Graphics Use Case

```typescript
// Vertex data with Float16 for memory-efficient graphics
class MeshData {
  positions: Float16Array; // xyz coordinates
  normals: Float16Array;   // normal vectors
  uvs: Float16Array;       // texture coordinates

  constructor(vertexCount: number) {
    this.positions = new Float16Array(vertexCount * 3);
    this.normals = new Float16Array(vertexCount * 3);
    this.uvs = new Float16Array(vertexCount * 2);
  }

  get memoryUsage(): number {
    return (
      this.positions.byteLength +
      this.normals.byteLength +
      this.uvs.byteLength
    );
  }
}

// Compare memory usage
const vertexCount = 100_000;
const mesh = new MeshData(vertexCount);
console.log(`Mesh memory: ${mesh.memoryUsage / 1024} KB`);
// With Float16: ~1562.5 KB
// With Float32: ~3125 KB (double!)
```

---

## 7. Pipeline Operator 🔗

> ⚠️ **Note**: Pipeline operator (`|>`) is still Stage 2 proposal.
> Currently needs Babel plugin. Expected in ES2026 or later.

### المشكلة القديمة

```javascript
// ❌ Nested function calls - hard to read
const result = capitalize(
  trim(
    removeSpecialChars(
      toLowerCase(userInput)
    )
  )
);

// ❌ Method chaining - only works if all return same type
const result = userInput
  .toLowerCase()
  .replace(/[^a-z]/g, '')
  .trim()
  .charAt(0).toUpperCase() + userInput.slice(1);
```

### الحل الجديد (Hack-style Pipeline)

```javascript
// ✅ Pipeline operator - reads left to right
const result = userInput
  |> toLowerCase(%)
  |> removeSpecialChars(%)
  |> trim(%)
  |> capitalize(%);

// % is the placeholder for the previous value
```

### ازاي تستخدمه النهارده (Babel)

```javascript
// babel.config.js
module.exports = {
  plugins: [
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'hack', topicToken: '%' }]
  ]
};
```

### Real-World Example: Data Transformation Pipeline

```typescript
// Type-safe pipeline helper (works today!)
function pipe<A>(value: A): A;
function pipe<A, B>(value: A, fn1: (a: A) => B): B;
function pipe<A, B, C>(value: A, fn1: (a: A) => B, fn2: (b: B) => C): C;
function pipe<A, B, C, D>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D
): D;
function pipe<A, B, C, D, E>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
  fn4: (d: D) => E
): E;
function pipe(value: unknown, ...fns: Function[]): unknown {
  return fns.reduce((acc, fn) => fn(acc), value);
}

// Usage
interface RawUser {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
}

interface DisplayUser {
  fullName: string;
  email: string;
  isAdult: boolean;
}

const transformUser = (raw: RawUser): DisplayUser =>
  pipe(
    raw,
    (user) => ({ ...user, fullName: `${user.firstName} ${user.lastName}` }),
    (user) => ({ ...user, isAdult: user.age >= 18 }),
    ({ fullName, email, isAdult }) => ({ fullName, email, isAdult })
  );

const rawUser: RawUser = {
  firstName: 'Ahmed',
  lastName: 'Lotfy',
  email: 'ahmed@example.com',
  age: 25,
};

const displayUser = transformUser(rawUser);
// { fullName: 'Ahmed Lotfy', email: 'ahmed@example.com', isAdult: true }
```

### Async Pipeline Pattern

```typescript
// Async pipeline helper
async function pipeAsync<A>(value: A | Promise<A>): Promise<A>;
async function pipeAsync<A, B>(
  value: A | Promise<A>,
  fn1: (a: A) => B | Promise<B>
): Promise<B>;
async function pipeAsync<A, B, C>(
  value: A | Promise<A>,
  fn1: (a: A) => B | Promise<B>,
  fn2: (b: B) => C | Promise<C>
): Promise<C>;
async function pipeAsync(
  value: unknown,
  ...fns: Function[]
): Promise<unknown> {
  let result = await value;
  for (const fn of fns) {
    result = await fn(result);
  }
  return result;
}

// Usage: API data processing pipeline
const processUserData = (userId: string) =>
  pipeAsync(
    userId,
    fetchUser,                    // async: fetch from API
    validateUser,                 // sync: validate schema
    enrichWithPermissions,        // async: add permissions
    transformToViewModel,         // sync: transform
    cacheResult                   // async: store in cache
  );
```

---

## 8. Object.groupBy() & Map.groupBy() 📦

### المشكلة القديمة

```javascript
// ❌ Manual grouping - verbose and error-prone
const users = [
  { name: 'Ahmed', role: 'admin', age: 25 },
  { name: 'Sara', role: 'user', age: 22 },
  { name: 'Mohamed', role: 'admin', age: 30 },
  { name: 'Nour', role: 'user', age: 28 },
];

const groupedByRole = users.reduce((acc, user) => {
  const key = user.role;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(user);
  return acc;
}, {});
```

### الحل الجديد

```javascript
// ✅ Object.groupBy() - clean and declarative
const groupedByRole = Object.groupBy(users, user => user.role);
// {
//   admin: [{ name: 'Ahmed', ... }, { name: 'Mohamed', ... }],
//   user: [{ name: 'Sara', ... }, { name: 'Nour', ... }]
// }

// ✅ Map.groupBy() - when you need Map (non-string keys, order preservation)
const groupedByAgeRange = Map.groupBy(users, user => {
  if (user.age < 25) return 'young';
  if (user.age < 30) return 'mid';
  return 'senior';
});
// Map {
//   'young' => [{ name: 'Sara', ... }],
//   'mid' => [{ name: 'Ahmed', ... }, { name: 'Nour', ... }],
//   'senior' => [{ name: 'Mohamed', ... }]
// }
```

### Real-World Example: Dashboard Analytics

```typescript
interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: Date;
  status: 'pending' | 'completed' | 'failed';
}

// Group by multiple dimensions
function analyzeTransactions(transactions: Transaction[]) {
  // By status
  const byStatus = Object.groupBy(transactions, t => t.status);
  
  // By category with totals
  const byCategory = Object.groupBy(transactions, t => t.category);
  const categoryTotals = Object.fromEntries(
    Object.entries(byCategory).map(([cat, txns]) => [
      cat,
      {
        count: txns!.length,
        total: txns!.reduce((sum, t) => sum + t.amount, 0),
      },
    ])
  );
  
  // By month (using Map for Date keys)
  const byMonth = Map.groupBy(transactions, t => {
    const d = new Date(t.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  
  // Complex grouping: status + category
  const byStatusAndCategory = Object.groupBy(
    transactions,
    t => `${t.status}:${t.category}`
  );

  return { byStatus, categoryTotals, byMonth, byStatusAndCategory };
}
```

### React Component: Grouped List

```tsx
interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

function TaskList({ tasks }: { tasks: Task[] }) {
  // Group tasks by priority
  const tasksByPriority = Object.groupBy(tasks, task => task.priority);
  
  // Order of priority sections
  const priorityOrder: Task['priority'][] = ['high', 'medium', 'low'];

  return (
    <div className="task-list">
      {priorityOrder.map(priority => {
        const priorityTasks = tasksByPriority[priority] ?? [];
        if (priorityTasks.length === 0) return null;
        
        return (
          <section key={priority} className={`priority-${priority}`}>
            <h2>{priority.charAt(0).toUpperCase() + priority.slice(1)} Priority</h2>
            <ul>
              {priorityTasks.map(task => (
                <li key={task.id} className={task.completed ? 'completed' : ''}>
                  {task.title}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

// With completion status grouping
function TaskBoard({ tasks }: { tasks: Task[] }) {
  const grouped = Object.groupBy(tasks, task => 
    task.completed ? 'done' : 'todo'
  );

  return (
    <div className="task-board">
      <Column title="To Do" tasks={grouped.todo ?? []} />
      <Column title="Done" tasks={grouped.done ?? []} />
    </div>
  );
}
```

---

## 9. Pattern Matching 🎯

> ⚠️ **Note**: Pattern Matching is Stage 1 proposal.
> Expected in ES2026/2027. Use TypeScript discriminated unions today.

### الـ Syntax المقترح

```javascript
// Future syntax (proposal)
const result = match (value) {
  when ({ type: 'success', data }) -> processData(data),
  when ({ type: 'error', message }) -> handleError(message),
  when ({ type: 'loading' }) -> showSpinner(),
  default -> unknownState(),
};
```

### ازاي تعمل Pattern Matching النهارده

```typescript
// ✅ TypeScript Discriminated Unions + Exhaustive Matching
type ApiResponse<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function handleResponse<T>(response: ApiResponse<T>): string {
  switch (response.status) {
    case 'idle':
      return 'Ready to fetch';
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Got data: ${JSON.stringify(response.data)}`;
    case 'error':
      return `Error: ${response.error.message}`;
    // TypeScript ensures all cases are handled!
  }
}

// If you add a new status, TypeScript will error until you handle it
```

### Advanced Pattern Matching Library: ts-pattern

```typescript
import { match, P } from 'ts-pattern';

// Complex matching with ts-pattern
type Shape =
  | { type: 'circle'; radius: number }
  | { type: 'rectangle'; width: number; height: number }
  | { type: 'triangle'; base: number; height: number };

function calculateArea(shape: Shape): number {
  return match(shape)
    .with({ type: 'circle' }, ({ radius }) => Math.PI * radius ** 2)
    .with({ type: 'rectangle' }, ({ width, height }) => width * height)
    .with({ type: 'triangle' }, ({ base, height }) => (base * height) / 2)
    .exhaustive();
}

// Pattern matching with guards
type User = {
  name: string;
  age: number;
  role: 'admin' | 'user' | 'guest';
  verified: boolean;
};

function getUserMessage(user: User): string {
  return match(user)
    .with({ role: 'admin' }, () => 'Welcome, Admin!')
    .with({ role: 'user', verified: true }, () => `Welcome back, ${user.name}!`)
    .with({ role: 'user', verified: false }, () => 'Please verify your email')
    .with({ role: 'guest', age: P.when(age => age >= 18) }, () => 'Welcome, Guest!')
    .with({ role: 'guest' }, () => 'You must be 18 or older')
    .exhaustive();
}

// Pattern matching on arrays
function processNumbers(nums: number[]): string {
  return match(nums)
    .with([], () => 'Empty array')
    .with([P.number], ([n]) => `Single number: ${n}`)
    .with([P.number, P.number], ([a, b]) => `Two numbers: ${a}, ${b}`)
    .with(P.array(P.number), (arr) => `Array of ${arr.length} numbers`)
    .exhaustive();
}
```

### React Pattern Matching for State

```tsx
import { match } from 'ts-pattern';

type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function DataView<T>({ 
  state, 
  renderData 
}: { 
  state: FetchState<T>; 
  renderData: (data: T) => React.ReactNode;
}) {
  return match(state)
    .with({ status: 'idle' }, () => (
      <div className="idle">Ready to load data</div>
    ))
    .with({ status: 'loading' }, () => (
      <div className="loading">
        <Spinner />
        <p>Loading...</p>
      </div>
    ))
    .with({ status: 'success' }, ({ data }) => (
      <div className="success">{renderData(data)}</div>
    ))
    .with({ status: 'error' }, ({ error }) => (
      <div className="error">
        <ErrorIcon />
        <p>{error.message}</p>
        <RetryButton />
      </div>
    ))
    .exhaustive();
}

// Usage
function UserProfile() {
  const [state, setState] = useState<FetchState<User>>({ status: 'idle' });

  return (
    <DataView
      state={state}
      renderData={(user) => (
        <Card>
          <Avatar src={user.avatar} />
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </Card>
      )}
    />
  );
}
```

---

## 10. Temporal API ⏰

### المشكل القديمة مع Date

```javascript
// ❌ Date API problems
const date = new Date('2024-03-15');
console.log(date.getMonth()); // 2 (not 3!) - zero-indexed months
console.log(date.getDay()); // Day of week, not day of month!

// Timezone chaos
const utcDate = new Date('2024-03-15T10:00:00Z');
const localDate = new Date('2024-03-15T10:00:00');
// Different values depending on your timezone!

// Mutation problems
const original = new Date();
const copy = original;
copy.setDate(copy.getDate() + 1);
console.log(original); // Also changed! Date is mutable

// Duration calculation - nightmare
const diff = date1 - date2; // Milliseconds... now what?
const days = diff / (1000 * 60 * 60 * 24); // Magic numbers everywhere
```

### Temporal API - الحل الشامل

```javascript
// ✅ Temporal - Modern date/time handling

// 1. Temporal.PlainDate - Date without time/timezone
const date = Temporal.PlainDate.from('2024-03-15');
console.log(date.month); // 3 (correct!)
console.log(date.dayOfWeek); // 5 (Friday)
console.log(date.daysInMonth); // 31

// 2. Temporal.PlainTime - Time without date/timezone
const time = Temporal.PlainTime.from('14:30:00');
console.log(time.hour); // 14
console.log(time.minute); // 30

// 3. Temporal.PlainDateTime - Date + Time, no timezone
const dateTime = Temporal.PlainDateTime.from('2024-03-15T14:30:00');
console.log(dateTime.toString()); // '2024-03-15T14:30:00'

// 4. Temporal.ZonedDateTime - Full timezone support
const zonedDT = Temporal.ZonedDateTime.from('2024-03-15T14:30:00[Africa/Cairo]');
console.log(zonedDT.timeZoneId); // 'Africa/Cairo'
console.log(zonedDT.offset); // '+02:00'

// Convert between timezones
const tokyoTime = zonedDT.withTimeZone('Asia/Tokyo');
console.log(tokyoTime.toString()); // '2024-03-15T21:30:00+09:00[Asia/Tokyo]'

// 5. Temporal.Duration - Clean duration handling
const duration = Temporal.Duration.from({ hours: 2, minutes: 30 });
console.log(duration.total('minutes')); // 150

// 6. Temporal.Instant - Exact moment in time (like Unix timestamp)
const now = Temporal.Now.instant();
console.log(now.epochMilliseconds);
```

### Immutability

```javascript
// ✅ All Temporal objects are immutable
const date = Temporal.PlainDate.from('2024-03-15');
const nextWeek = date.add({ days: 7 }); // Returns NEW object

console.log(date.toString()); // '2024-03-15' (unchanged)
console.log(nextWeek.toString()); // '2024-03-22' (new object)
```

### Real-World Example: Event Scheduling

```typescript
class EventScheduler {
  // Schedule event in user's timezone
  scheduleEvent(
    title: string,
    dateTime: string,
    timezone: string,
    duration: Temporal.Duration
  ) {
    const startTime = Temporal.ZonedDateTime.from(
      `${dateTime}[${timezone}]`
    );
    const endTime = startTime.add(duration);

    return {
      title,
      start: startTime,
      end: endTime,
      // Store as Instant for database
      startInstant: startTime.toInstant(),
      endInstant: endTime.toInstant(),
    };
  }

  // Check if event is happening now
  isEventLive(event: { start: Temporal.ZonedDateTime; end: Temporal.ZonedDateTime }) {
    const now = Temporal.Now.instant();
    return (
      Temporal.Instant.compare(now, event.start.toInstant()) >= 0 &&
      Temporal.Instant.compare(now, event.end.toInstant()) < 0
    );
  }

  // Get time until event in user's preferred units
  getTimeUntilEvent(
    event: { start: Temporal.ZonedDateTime },
    unit: 'hours' | 'minutes' | 'days' = 'hours'
  ): number {
    const now = Temporal.Now.instant();
    const duration = now.until(event.start.toInstant());
    return Math.floor(duration.total(unit));
  }

  // Find available slots
  findAvailableSlots(
    existingEvents: Array<{ start: Temporal.ZonedDateTime; end: Temporal.ZonedDateTime }>,
    date: Temporal.PlainDate,
    timezone: string,
    slotDuration: Temporal.Duration
  ) {
    const dayStart = date.toZonedDateTime({ timeZone: timezone, plainTime: '09:00' });
    const dayEnd = date.toZonedDateTime({ timeZone: timezone, plainTime: '17:00' });
    
    const availableSlots: Temporal.ZonedDateTime[] = [];
    let currentSlot = dayStart;

    while (Temporal.ZonedDateTime.compare(currentSlot.add(slotDuration), dayEnd) <= 0) {
      const slotEnd = currentSlot.add(slotDuration);
      
      const hasConflict = existingEvents.some(event => {
        // Check overlap
        return !(
          Temporal.ZonedDateTime.compare(slotEnd, event.start) <= 0 ||
          Temporal.ZonedDateTime.compare(currentSlot, event.end) >= 0
        );
      });

      if (!hasConflict) {
        availableSlots.push(currentSlot);
      }

      currentSlot = currentSlot.add({ minutes: 30 }); // 30-min intervals
    }

    return availableSlots;
  }
}

// Usage
const scheduler = new EventScheduler();

const meeting = scheduler.scheduleEvent(
  'Team Standup',
  '2024-03-15T10:00',
  'Africa/Cairo',
  Temporal.Duration.from({ hours: 1 })
);

console.log(`Meeting starts: ${meeting.start.toString()}`);
// 'Meeting starts: 2024-03-15T10:00:00+02:00[Africa/Cairo]'

console.log(`In UTC: ${meeting.startInstant.toString()}`);
// 'In UTC: 2024-03-15T08:00:00Z'
```

### React Hooks for Temporal

```tsx
// Custom hooks for Temporal API
function useCurrentTime(timezone?: string) {
  const [time, setTime] = useState(() => 
    timezone
      ? Temporal.Now.zonedDateTimeISO(timezone)
      : Temporal.Now.plainDateTimeISO()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        timezone
          ? Temporal.Now.zonedDateTimeISO(timezone)
          : Temporal.Now.plainDateTimeISO()
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  return time;
}

function useCountdown(targetDate: Temporal.ZonedDateTime) {
  const [remaining, setRemaining] = useState<Temporal.Duration | null>(null);

  useEffect(() => {
    const updateRemaining = () => {
      const now = Temporal.Now.instant();
      const target = targetDate.toInstant();
      
      if (Temporal.Instant.compare(now, target) >= 0) {
        setRemaining(null);
        return;
      }

      setRemaining(now.until(target));
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return remaining;
}

// Usage in component
function EventCountdown({ event }: { event: { start: Temporal.ZonedDateTime } }) {
  const remaining = useCountdown(event.start);

  if (!remaining) {
    return <div>Event has started!</div>;
  }

  const hours = Math.floor(remaining.total('hours'));
  const minutes = Math.floor(remaining.total('minutes')) % 60;
  const seconds = Math.floor(remaining.total('seconds')) % 60;

  return (
    <div className="countdown">
      <span>{hours}h</span>
      <span>{minutes}m</span>
      <span>{seconds}s</span>
    </div>
  );
}
```

### Polyfill للاستخدام الآن

```bash
# Install the polyfill
bun add @js-temporal/polyfill
```

```typescript
// At app entry point
import { Temporal, Intl, toTemporalInstant } from '@js-temporal/polyfill';

// Extend Date prototype for easy migration
Date.prototype.toTemporalInstant = toTemporalInstant;

// Now you can use Temporal everywhere!
const now = Temporal.Now.instant();
```

---

## 📊 Browser & Runtime Support Summary

| Feature | Chrome | Firefox | Safari | Node.js | Bun |
|---------|--------|---------|--------|---------|-----|
| Iterator Helpers | ✅ 122+ | ✅ 131+ | ✅ 17.4+ | ✅ 22+ | ✅ |
| Set Methods | ✅ 122+ | ✅ 127+ | ✅ 17+ | ✅ 22+ | ✅ |
| RegExp.escape | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| Promise.try | ✅ 128+ | ⏳ | ⏳ | ⏳ | ⏳ |
| Import Attributes | ✅ 123+ | ⏳ | ⏳ | ✅ 21+ | ✅ |
| Float16Array | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| Pipeline Operator | ❌ (Babel) | ❌ (Babel) | ❌ (Babel) | ❌ (Babel) | ❌ |
| Object.groupBy | ✅ 117+ | ✅ 119+ | ✅ 17.4+ | ✅ 21+ | ✅ |
| Pattern Matching | ❌ (ts-pattern) | ❌ | ❌ | ❌ | ❌ |
| Temporal API | ⏳ (polyfill) | ⏳ | ⏳ | ⏳ | ⏳ |

### Legend:
- ✅ = Fully supported
- ⏳ = Coming soon / In development
- ❌ = Not supported (use polyfill/library)

---

## 🎯 Quick Migration Checklist

```markdown
□ Replace [...iterator].map/filter with iterator.map/filter
□ Use Set methods instead of manual set operations
□ Add RegExp.escape for user input in regex
□ Use Promise.try for mixed sync/async error handling
□ Migrate to import attributes for JSON imports
□ Consider Float16Array for large numeric datasets
□ Implement pipe() helper for function composition
□ Replace reduce-based grouping with Object.groupBy
□ Use ts-pattern for complex conditional logic
□ Add Temporal polyfill and migrate from Date
```

---

## 📚 Resources

- [TC39 Proposals](https://github.com/tc39/proposals)
- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ts-pattern Library](https://github.com/gvergnaud/ts-pattern)
- [Temporal Documentation](https://tc39.es/proposal-temporal/docs/)

---

> **Author**: Generated by Senior Web Developer
> **Last Updated**: January 2025
> **Version**: 1.0

*"Write code for 2025, not 2022. Your future self will thank you."* 🚀
