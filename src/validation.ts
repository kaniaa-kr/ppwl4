import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())
  .post("/request",
  ({ body }) => {
    return {
      message: "Success",
        data: body
      }
  },
  {
    body: t.Object({
      name: t.String({ minLength: 3 }),
      email: t.String({ format: "email" }),
        age: t.Number({ minimum: 18 })
      })
    }
  )

app.get(
  "/products/:id",
  ({ params, query }) => {
    return {
      productId: params.id,
     sortBy: query.sort
   }
  },
  {
    query: t.Object({
     sort: t.Union([t.Literal("asc"), t.Literal("desc")])
    }),
    params: t.Object({
     id: t.Number()
   })
 }
)

app.get(
  "/stats",
  () => {
    return {
      total: 100,
      active: 10
    }
  },
  {
    response: t.Object({
      total: t.Number(),
      active: t.Number()
    })
  }
)

app.get(
 "/admin",
 () => {
  return {
    stats: 99
  }
 },
 {
   headers: t.Object({
    authorization: t.String()
   }),
   beforeHandle({ headers, set }) {
     if (headers.authorization !== "Bearer 123") {
       set.status = 401
       return {
         success: false,
         message: "Unauthorized"
       }
     }
   }
 }
)

app.onAfterHandle(({ response }) => {
 return {
   success: true,
   Message: "data tersedia",
   data: response
 }
})

app.get(
  "/product",
  () => {
    return {id: 1, name: "Laptop"}
})

.listen(3000);


console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);