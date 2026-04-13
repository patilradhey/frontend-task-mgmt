import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/Protected";
import CreateTask from "./pages/CreateTask";
import AllTasks from "./pages/AllTasks";
import Users from "./pages/Users";
import MyTasks from "./pages/MyTasks";
import Profile from './pages/Profile'

function App() {
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/" element={<Login />}></Route>

        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <Dashboard isDark={isDark} toggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/create-task"
          element={
            <ProtectedRoute>
              <CreateTask isDark={isDark} toggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/all-tasks"
          element={
            <ProtectedRoute>
              <AllTasks isDark={isDark} toggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users isDark={isDark} toggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <MyTasks isDark={isDark} toggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile isDark={isDark} toggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
