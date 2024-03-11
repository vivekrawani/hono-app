import { Hono } from "hono";
import { Context } from "hono";

const app = new Hono();

const authMiddleware =  async (c : Context, next : any) => {
  const condition = false;
  if(condition) {
      await next();
  }else {
      console.log("Not authorized!");
      return c.json({message : "Oops! This is not allowed!"}, 403)
  }
  
}

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/", authMiddleware, async (c) => {
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
});

export default app;
