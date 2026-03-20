import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import Categories from "./pages/Categories";

import Login from "./pages/Login";
import CreateLibrarian from "./pages/CreateLibrarian";
import CreateReader from "./pages/CreateReader";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import LibrariansList from "./pages/LibrariansList";
import ReadersList from "./pages/ReadersList";
import ReaderDetail from "./pages/ReaderDetail";
import ReaderUpdate from "./pages/ReaderUpdate";
import SetupPassword from "./pages/SetupPassword";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="grow pt-10 px-0">

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/categories/:categoryName" element={<Categories />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-librarian" element={
          <ProtectedRoute allowedRoles="superuser">
            <CreateLibrarian />
          </ProtectedRoute>
        } />
        <Route path="/create-reader" element={
          <ProtectedRoute allowedRoles={["librarian", "superuser"]}>
            <CreateReader />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/librarians" element={
          <ProtectedRoute>
            <LibrariansList />
          </ProtectedRoute>
        } />
        <Route path="/readers" element={
          <ProtectedRoute allowedRoles={["librarian", "superuser"]}>
            <ReadersList />
          </ProtectedRoute>
        } />
        <Route path="/readers/:id" element={
          <ProtectedRoute allowedRoles={["librarian", "superuser"]}>
            <ReaderDetail />
          </ProtectedRoute>
        } />
        <Route path="/unauthorized" element={<div className="p-10 text-center text-red-500">Unauthorized Access</div>} />
        <Route path="/readers/:id/update" element={
          <ProtectedRoute allowedRoles={["librarian", "superuser"]}>
            <ReaderUpdate />
          </ProtectedRoute>
        } />
        <Route path="/setup-password/:uidb64/:token/" element={<SetupPassword />} />
      </Routes>
      </main>
      <Footer />
      </div>
    </Router>
  );
}

export default App;