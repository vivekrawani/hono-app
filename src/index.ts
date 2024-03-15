import { Hono } from "hono";
import { Context } from "hono";
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.configDotenv()


const app = new Hono();

const authMiddleware =  async (c : Context, next : any) => {
  const milli = new Date().getTime();
  const ten_seconds = Math.floor((milli / 1000 ) / 10);
  const condition = (ten_seconds % 2 == 0);
  if(condition) {
      await next();
  }else {
      console.log("Not authorized!");
      return c.json({message : "Can't handle the request now"}, 403)
  }
  
}

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/", authMiddleware, async (c) => {
  try {
    const header = c.req.header("User-Agent");
    const qrs = c.req.queries();
    const id = c.req.query("id");
    const body = await c.req.json();
    console.log("id :", id);
  
    console.log("header : ",header);
    console.log("queries -> ", qrs)
    return c.json({
      message: "Hello! this is post request",
      header,
      id,
      body,
      qrs,
    });
  } catch (error) {
    return c.json({message : "Bad Request bro!"}, 400)
  }
 
});
app.get("/user", async(c : Context)=>{
  const pool = new Pool({ connectionString: c.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })
  const users = await prisma.user.findMany()
  return c.json(users);
})

app.post("/user", async(c : Context)=>{
  const pool = new Pool({ connectionString: c.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })
  const body =  await c.req.json();
  console.log(body)
  const users = await prisma.user.create({
    data : {
      email : body.email,

    }
  })
  const result = JSON.stringify(users)
  return c.json(users);
})

export default app;
