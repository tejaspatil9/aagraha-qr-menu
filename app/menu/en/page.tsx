"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Category = {
  id: string;
  name_en: string;
};

type Dish = {
  id: string;
  category_id: string;
  name_en: string;
  description_en: string | null;
  price: number;
  is_veg: boolean;
  is_recommended: boolean;
  image: string | null;
};

type CartItem = Dish & {
  qty: number;
  note: string;
};

const OWNER_WHATSAPP = "919545597705"; // 👈 change

export default function MenuEnglish() {
  /* ---------- TABLE ---------- */
  const TABLES = Array.from({ length: 15 }, (_, i) => i + 1);
  const [tableNo, setTableNo] = useState<number | null>(null);

  /* ---------- CUSTOMER ---------- */
  const [customerName, setCustomerName] = useState("");

  /* ---------- MENU ---------- */
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [vegOnly, setVegOnly] = useState(false);

  /* ---------- CART ---------- */
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showWaiterView, setShowWaiterView] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: catData } = await supabase
        .from("categories")
        .select("id, name_en")
        .eq("restaurant_id", "aagraha")
        .eq("active", true)
        .order("sort_order");

      const { data: dishData } = await supabase
        .from("dishes")
        .select("*")
        .eq("restaurant_id", "aagraha")
        .eq("available", true)
        .order("created_at");

      setCategories(catData || []);
      setDishes(dishData || []);
    }
    load();
  }, []);

  /* ---------- CART HELPERS ---------- */
  function addToCart(dish: Dish) {
    setCart((prev) => {
      const found = prev.find((i) => i.id === dish.id);
      if (found) {
        return prev.map((i) =>
          i.id === dish.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...dish, qty: 1, note: "" }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qty: i.qty + delta } : i
        )
        .filter((i) => i.qty > 0)
    );
  }

  function updateNote(id: string, note: string) {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, note } : i))
    );
  }

  const itemsTotal = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  /* ---------- WHATSAPP ---------- */
  function sendWhatsApp() {
    let msg = `🍽️ *New Table Order*\n\n`;
    msg += `*Table:* ${tableNo}\n`;
    if (customerName) msg += `*Name:* ${customerName}\n`;
    msg += `\n*Order:*`;

    cart.forEach((i, idx) => {
      msg += `\n${idx + 1}. ${i.name_en} × ${i.qty} — ₹${
        i.price * i.qty
      }`;
      if (i.note) msg += `\n   _Note:_ ${i.note}`;
    });

    msg += `\n\n*Items Total:* ₹${itemsTotal}`;

    window.open(
      `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }

  /* ---------- WAITER VIEW ---------- */
  if (showWaiterView) {
    return (
      <main className="min-h-screen bg-white text-black p-6">
        <h1 className="text-xl mb-2">Table {tableNo}</h1>
        {customerName && <p>Name: {customerName}</p>}
        <hr className="my-4" />

        {cart.map((i) => (
          <div key={i.id} className="mb-3">
            <strong>
              {i.name_en} × {i.qty}
            </strong>{" "}
            — ₹{i.price * i.qty}
            {i.note && (
              <div className="text-sm text-gray-700">
                Note: {i.note}
              </div>
            )}
          </div>
        ))}

        <hr className="my-4" />
        <strong>Total: ₹{itemsTotal}</strong>

        <button
          onClick={() => setShowWaiterView(false)}
          className="mt-6 w-full bg-black text-white py-3 rounded"
        >
          Back
        </button>
      </main>
    );
  }

  /* ---------- MENU ---------- */
  return (
    <main className="min-h-screen bg-black text-white px-4 pb-32">

      {/* TABLE SELECT */}
      <div className="sticky top-0 z-30 bg-black py-3 mb-4">
        <p className="text-sm mb-2">Select your table</p>
        <div className="flex gap-2 overflow-x-auto">
          {TABLES.map((t) => (
            <button
              key={t}
              onClick={() => setTableNo(t)}
              className={`px-4 py-2 rounded-full text-sm border
                ${
                  tableNo === t
                    ? "bg-[#7a1f1f] border-[#7a1f1f]"
                    : "border-gray-600"
                }`}
            >
              Table {t}
            </button>
          ))}
        </div>
      </div>

      {!tableNo && (
        <p className="text-center text-sm text-gray-400 mt-10">
          Please select a table to start ordering
        </p>
      )}

      {tableNo && (
        <>
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl">Menu</h1>
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`px-3 py-1 rounded-full text-sm border
                ${
                  vegOnly
                    ? "bg-green-600 border-green-600"
                    : "border-gray-500"
                }`}
            >
              🥗 Veg Only
            </button>
          </div>

          {categories.map((cat) => (
            <section key={cat.id} className="mb-10">
              <h2 className="text-lg mb-3">{cat.name_en}</h2>

              {dishes
                .filter((d) => d.category_id === cat.id)
                .filter((d) => (vegOnly ? d.is_veg : true))
                .map((dish) => (
                  <div
                    key={dish.id}
                    className="flex gap-4 bg-[#111] rounded-xl p-4 mb-3"
                  >
                    {dish.image && (
                      <img
                        src={dish.image}
                        className="w-[90px] h-[90px] rounded-lg object-cover"
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <strong>{dish.name_en}</strong>
                        <span>₹{dish.price}</span>
                      </div>

                      {dish.description_en && (
                        <p className="text-sm text-gray-400">
                          {dish.description_en}
                        </p>
                      )}

                      <button
                        onClick={() => addToCart(dish)}
                        className="mt-2 text-sm bg-[#7a1f1f] px-3 py-1 rounded"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
            </section>
          ))}
        </>
      )}

      {/* CART BAR */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-700 p-4">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-[#7a1f1f] py-3 rounded"
          >
            View Cart • ₹{itemsTotal}
          </button>
        </div>
      )}

      {/* CART MODAL */}
      {showCart && (
        <div className="fixed inset-0 bg-black z-50 p-4 overflow-auto">
          <h2 className="text-xl mb-4">Your Order</h2>

          <input
            placeholder="Your name (optional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-black border border-gray-700 p-3 rounded mb-4"
          />

          {cart.map((i) => (
            <div key={i.id} className="mb-4">
              <div className="flex justify-between">
                <strong>{i.name_en}</strong>
                <span>₹{i.price * i.qty}</span>
              </div>

              <div className="flex gap-2 my-2">
                <button onClick={() => updateQty(i.id, -1)}>-</button>
                <span>{i.qty}</span>
                <button onClick={() => updateQty(i.id, 1)}>+</button>
              </div>

              <textarea
                placeholder="Add note (optional)"
                value={i.note}
                onChange={(e) => updateNote(i.id, e.target.value)}
                className="w-full bg-black border border-gray-700 p-2 rounded text-sm"
              />
            </div>
          ))}

          <div className="mt-4 font-medium">
            Items Total: ₹{itemsTotal}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowWaiterView(true)}
              className="flex-1 bg-gray-600 py-3 rounded"
            >
              Show to Waiter
            </button>

            <button
              onClick={sendWhatsApp}
              className="flex-1 bg-green-600 py-3 rounded"
            >
              WhatsApp Order
            </button>
          </div>

          <button
            onClick={() => setShowCart(false)}
            className="mt-4 w-full border border-gray-600 py-3 rounded"
          >
            Close
          </button>
        </div>
      )}
    </main>
  );
}
