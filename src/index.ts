import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/post', (c)=>{
  return c.json({ message : "Hello! this is post request"})
})

export default app
