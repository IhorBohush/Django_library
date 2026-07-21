import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
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
import LibrarianUpdate from "./pages/LibrarianUpdate";
import CreateProfession from "./pages/CreateProfession";
import ProfessionsList from "./pages/ProfessionsList";
import EditProfession from "./pages/ProfessionUpdate";
import CreateCategory from "./pages/CreateCategory";
import CategoriesList from "./pages/CategoriesList";
import EditCategory from "./pages/CategoryUpdate";
import CreateBook from "./pages/CreateBook";
import BookDetail from "./pages/BookDetail";
import BooksList from "./pages/BooksList";
import EditBook from "./pages/BookUpdate";
import CreateOrder from "./pages/CreateOrder";
import ListOrders from "./pages/OrderList";
import DetailOrder from "./pages/OrderDetail";
import ManageAbout from "./pages/ManageAbout";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="grow pt-10 px-0">

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
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
          <ProtectedRoute allowedRoles="superuser">
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
        <Route path="/librarians/:id/update" element={
          <ProtectedRoute allowedRoles="librarian">
            <LibrarianUpdate />
          </ProtectedRoute>
        } />
        <Route path="/professions" element={
          <ProtectedRoute allowedRoles="librarian">
            <ProfessionsList />
          </ProtectedRoute>
        } />
        <Route path="/create-profession" element={
          <ProtectedRoute allowedRoles="librarian">
            <CreateProfession />
          </ProtectedRoute>
        } />
        <Route path="/professions/:id/update" element={
          <ProtectedRoute allowedRoles="librarian">
            <EditProfession />
          </ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute allowedRoles="librarian">
            <CategoriesList />
          </ProtectedRoute>
          } />
        <Route path="/create-category" element={
          <ProtectedRoute allowedRoles="librarian">
            <CreateCategory />
          </ProtectedRoute>
        } />
        <Route path="/categories/:id/update" element={
          <ProtectedRoute allowedRoles="librarian">
            <EditCategory />
          </ProtectedRoute>
        } />
        <Route path="/books" element={<BooksList />} />
        <Route path="/create-book" element={
          <ProtectedRoute allowedRoles="librarian">
            <CreateBook />
          </ProtectedRoute>
        } />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/books/:id/update" element={
          <ProtectedRoute allowedRoles="librarian">
            <EditBook />
          </ProtectedRoute>
        } />
        <Route path="/orders/create" element={
          <ProtectedRoute allowedRoles="librarian">
            <CreateOrder />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute allowedRoles="librarian">
            <ListOrders />
          </ProtectedRoute>
        } />
        <Route path="/orders/:id" element={
          <ProtectedRoute allowedRoles="librarian">
            <DetailOrder />
          </ProtectedRoute>    
        } />
        <Route path="/manage-about" element={
          <ProtectedRoute allowedRoles="librarian">
            <ManageAbout />
          </ProtectedRoute>
        } />
      </Routes>
      </main>
      <Footer />
      </div>
    </Router>
  );
}

export default App;