import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import {
  getCartItems,
  addCartItems,
  updateCartItems,
  deleteCartItems
} from './controllers/cartItems.ts';

const router = new Router();
const app = new Application();
const PORT = 5001;

router
    .post("/api/cart-items", addCartItems)
    .get("/api/cart-items", getCartItems)
    .post("/api/cart-items/:id", updateCartItems)
    .delete("/api/cart-items/:id", deleteCartItems)

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({port: PORT});
console.log(`Server started listening at ${PORT}`);