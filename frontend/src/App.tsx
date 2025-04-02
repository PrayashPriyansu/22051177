import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import TopUsers from "@/pages/TopUsers";
import TrendingPosts from "@/pages/TrendingPosts";
import Feed from "@/pages/Feed";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/top-users" element={<TopUsers />} />
            <Route path="/trending-posts" element={<TrendingPosts />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
