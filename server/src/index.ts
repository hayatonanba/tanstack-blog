// src/index.ts
import { Hono } from 'hono'
import { serve } from '@hono/node-server'   // ★ Node 用アダプタ
import { app as routes } from '../src/route.js' // 拡張子 .ts を忘れず

const app = new Hono().basePath('/api')
app.route('/', routes)

const port = Number(process.env.PORT ?? 8787)

// ★ ここだけで起動完了。addEventListener は不要
serve({ fetch: app.fetch, port })
console.log(`API listening on http://localhost:${port}/api/posts`)
