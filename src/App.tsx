import { HashRouter, Route, Routes } from "react-router-dom";
import { TopNav } from "./components/layout/TopNav";
import { Account } from "./routes/Account";
import { Admin } from "./routes/Admin";
import { Cart } from "./routes/Cart";
import { Checkout } from "./routes/Checkout";
import { Home } from "./routes/Home";
import { Login } from "./routes/Login";

export function App() {
  return (
    <HashRouter>
      <div className="min-h-dvh">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <TopNav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}
