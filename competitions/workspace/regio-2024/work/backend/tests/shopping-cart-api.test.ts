import { BASE_URL, REQUEST_TIMEOUT_MS } from "./settings";

type CreatedCart = {
  cartId: string;
};

const createCart = async (): Promise<CreatedCart> => {
  const response = await fetch(`${BASE_URL}/api/carts`, {
    method: "POST",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  return await response.json();
};

describe("Shopping Cart API", () => {
  describe("General", () => {
    it(`can be reached at ${BASE_URL}`, async () => {
      const response = await fetch(`${BASE_URL}`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      expect(response).toBeTruthy();
    });
    it("should return 404 error for a non-existent route", async () => {
      const response = await fetch(`${BASE_URL}/non-existent-route`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      expect(response.status).toBe(404);
      const error = await response.json();
      expect(error.error).toBe("Route not found");
    });
  });

  describe("Cart creation", () => {
    it("should create a new shopping cart", async () => {
      const cart = await createCart();
      expect(cart.cartId).toBeTruthy();
    });
  });

  describe("Add cart items", () => {
    it("should add items to cart", async () => {
      const cart = await createCart();
      const productId = 1;
      const quantity = 2;

      const response = await fetch(
        `${BASE_URL}/api/carts/${cart.cartId}/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );

      expect(response.status).toBe(201);
    });

    it("should return 404 error for a non-existent cart", async () => {
      const productId = 1;
      const quantity = 2;

      const response = await fetch(
        `${BASE_URL}/api/carts/non-existent-cart/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );
      expect(response.status).toBe(404);
      const error = await response.json();
      expect(error.error).toBe("Cart not found");
    });

    it("should return an error for non-existent product", async () => {
      const cart = await createCart();
      const productId = 999;
      const quantity = 2;

      const response = await fetch(
        `${BASE_URL}/api/carts/${cart.cartId}/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );
      expect(response.status).toBe(404);
      const error = await response.json();
      expect(error.error).toBe(`Product with ID ${productId} not found`);
    });

    it("should return an error for negative quantity", async () => {
      const cart = await createCart();
      const productId = 1;
      const quantity = -2;

      const response = await fetch(
        `${BASE_URL}/api/carts/${cart.cartId}/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );
      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error.error).toBe("Quantity must be a positive number");
    });
  });

  describe("Update cart items", () => {
    it("should update item quantity in cart", async () => {
      const cart = await createCart();
      const productId = 1;
      const quantity = 3;

      const response = await fetch(
        `${BASE_URL}/api/carts/${cart.cartId}/items/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );

      expect(response.status).toBe(200);
    });

    it("should return an error for non-existent product", async () => {
      const cart = await createCart();
      const productId = 999;
      const quantity = 3;

      const response = await fetch(
        `${BASE_URL}/api/carts/${cart.cartId}/items/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );
      expect(response.status).toBe(404);
      const error = await response.json();
      expect(error.error).toBe(
        `Product with ID ${productId} not found in cart`
      );
    });

    it("should return an error for negative quantity", async () => {
      const cart = await createCart();
      const productId = 1;
      const quantity = -3;

      const response = await fetch(
        `${BASE_URL}/api/carts/${cart.cartId}/items/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );
      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error.error).toBe("Quantity must be a positive number");
    });
  });

  describe("Remove cart items", () => {
    it("should remove item from cart", async () => {
      const cart = await createCart();
      const productId = 1;

      const response = await fetch(
        `${BASE_URL}/api/carts/${cart.cartId}/items/${productId}`,
        {
          method: "DELETE",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );

      expect(response.status).toBe(200);
    });

    it("should return an error for non-existent product", async () => {
      const cart = await createCart();
      const productId = 999;

      const response = await fetch(
        `${BASE_URL}/api/carts/${cart.cartId}/items/${productId}`,
        {
          method: "DELETE",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );
      expect(response.status).toBe(404);
      const error = await response.json();
      expect(error.error).toBe(
        `Product with ID ${productId} not found in cart`
      );
    });
  });

  describe("View cart", () => {
    it("should view empty cart", async () => {
      const cart = await createCart();
      const response = await fetch(`${BASE_URL}/api/carts/${cart.cartId}`, {
        method: "GET",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.cartId).toBe(cart.cartId);
      expect(data.status).toBe("open");
      expect(data.items.length).toBe(0); // Assuming the item was removed in the previous test
    });

    it("should view cart with items", async () => {
      const cart = await createCart();

      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: 1, quantity: 1 }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: 2, quantity: 2 }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      const response = await fetch(`${BASE_URL}/api/carts/${cart.cartId}`, {
        method: "GET",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.cartId).toBe(cart.cartId);
      expect(data.status).toBe("open");
      expect(data.items.length).toBe(2);
      expect(data.items[0].id).toBe(1);
      expect(data.items[0].quantity).toBe(1);
      expect(data.items[1].id).toBe(2);
      expect(data.items[1].quantity).toBe(2);
    });

    it("should return 404 error for a non-existent cart", async () => {
      const response = await fetch(`${BASE_URL}/api/carts/non-existent-cart`, {
        method: "GET",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      expect(response.status).toBe(404);
      const error = await response.json();
      expect(error.error).toBe("Cart not found");
    });
  });

  describe("Checkout", () => {
    it("should checkout", async () => {
      const cart = await createCart();
      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: 1, quantity: 1 }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const response = await fetch(
        `${BASE_URL}/api/carts/${cart.cartId}/checkout`,
        {
          method: "POST",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe("Checkout successful. Order placed.");
    });

    it('should change the cart status to "checked out"', async () => {
      const cart = await createCart();
      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: 1, quantity: 1 }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/checkout`, {
        method: "POST",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      const response = await fetch(`${BASE_URL}/api/carts/${cart.cartId}`, {
        method: "GET",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const data = await response.json();

      expect(data.status).toBe("checked out");
    });

    it("should return 404 error for a non-existent cart", async () => {
      const response = await fetch(
        `${BASE_URL}/api/carts/non-existent-cart/checkout`,
        {
          method: "POST",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );
      expect(response.status).toBe(404);
      const error = await response.json();
      expect(error.error).toBe("Cart not found");
    });

    it("should return an error for an empty cart", async () => {
      const cart = await createCart();
      const response = await fetch(
        `${BASE_URL}/api/carts/${cart.cartId}/checkout`,
        {
          method: "POST",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );
      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error.error).toBe("Cart is empty");
    });

    it("should return an error when checking out for a cart with status checked out", async () => {
      const cart = await createCart();
      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: 1, quantity: 1 }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/checkout`, {
        method: "POST",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      const response = await fetch(
        `${BASE_URL}/api/carts/${cart.cartId}/checkout`,
        {
          method: "POST",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );
      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error.error).toBe("Cart is already checked out");
    });

    it("should return an error when adding items for a cart with status checked out", async () => {
      const cart = await createCart();
      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: 1, quantity: 1 }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/checkout`, {
        method: "POST",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      const response = await fetch(
        `${BASE_URL}/api/carts/${cart.cartId}/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: 2, quantity: 2 }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );
      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error.error).toBe("Cart is already checked out");
    });

    it("should return an error when updating items for a cart with status checked out", async () => {
      const cart = await createCart();
      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: 1, quantity: 1 }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/checkout`, {
        method: "POST",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      const response = await fetch(
        `${BASE_URL}/api/carts/${cart.cartId}/items/1`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: 3 }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );
      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error.error).toBe("Cart is already checked out");
    });

    it("should return an error when removing items for a cart with status checked out", async () => {
      const cart = await createCart();
      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: 1, quantity: 1 }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/checkout`, {
        method: "POST",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      const response = await fetch(
        `${BASE_URL}/api/carts/${cart.cartId}/items/1`,
        {
          method: "DELETE",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );
      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error.error).toBe("Cart is already checked out");
    });
  });

  describe("Price and Discounts", () => {
    it("should return the price", async () => {
      const cart = await createCart();
      const productId = 1;
      const quantity = 2;

      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const response = await fetch(`${BASE_URL}/api/carts/${cart.cartId}`, {
        method: "GET",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      const data = await response.json();
      expect(data.originalPrice).toBe(80);
      expect(data.discountedPrice).toBe(80);
      expect(data.items[0].price).toBe(40);
    });

    it("should return the price with fixed amount discount", async () => {
      const cart = await createCart();
      const productId = 1;
      const quantity = 3;

      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const response = await fetch(`${BASE_URL}/api/carts/${cart.cartId}`, {
        method: "GET",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      const data = await response.json();
      expect(data.originalPrice).toBe(120);
      expect(data.discountedPrice).toBe(100);
    });

    it("should return the price with percentage discount", async () => {
      const cart = await createCart();
      const productId = 2;
      const quantity = 5;

      await fetch(`${BASE_URL}/api/carts/${cart.cartId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const response = await fetch(`${BASE_URL}/api/carts/${cart.cartId}`, {
        method: "GET",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      const data = await response.json();
      expect(data.originalPrice).toBe(50);
      expect(data.discountedPrice).toBe(45);
    });
  });
});
