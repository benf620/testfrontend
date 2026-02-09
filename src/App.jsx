import Header from "./components/Header";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-5 px-2.5">
        <Home />
      </main>
    </div>
  )
}
