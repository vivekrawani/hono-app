import { Hono } from "hono";
import { Context } from "hono";

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

export default app;
