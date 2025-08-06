import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from './db.js'
import { posts } from './schema.js'
import { desc, eq } from 'drizzle-orm'

export const app = new Hono()

app.use('/*', cors()) // フロントから叩けるように

const createPostSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
})

app.get('/posts', async (c) => {
  const data = await db.select().from(posts).orderBy(desc(posts.id))
  return c.json(data)
})

app.get('/posts/:id', async (c) => {
  const id = Number(c.req.param('id'))
  // if (!Number.isFinite(id)) {
  //   return c.json({ message: 'Invalid id' }, 400)
  // }
  const data = await db.select().from(posts).where(eq(posts.id, id))
  if (data.length === 0) return c.json({ message: 'Not Found' }, 404)
  return c.json(data[0])
})

app.post('/posts', zValidator('json', createPostSchema), async (c) => {
  const values = await c.req.valid('json')
  const inserted = await db
    .insert(posts)
    .values(values)
    .returning()
  return c.json(inserted[0], 201)
})

app.patch('/posts/:id', zValidator('json', createPostSchema.partial()), async (c) => {
  const id = Number(c.req.param('id'))
  const values = await c.req.valid('json')
  const updated = await db.update(posts).set(values).where(eq(posts.id, id)).returning()
  if (updated.length === 0) return c.json({ message: 'Not Found' }, 404)
  return c.json(updated[0])
})

app.delete('/posts/:id', async (c) => {
  const id = Number(c.req.param('id'))
  await db.delete(posts).where(eq(posts.id, id))
  return c.body(null, 204)
})
