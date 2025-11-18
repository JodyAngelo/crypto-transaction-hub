import {
  Navbar,
  Welcome,
  Footer,
} from "./components";

export default function App() {
  return (
    <div className="min-h-screen app-background">
      <Navbar />
      <Welcome />
      <Footer />
    </div>
  );
}
