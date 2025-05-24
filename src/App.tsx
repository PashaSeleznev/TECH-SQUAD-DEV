import {Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import AccountPage from "./pages/AccountPage";
import ReportsPage from "./pages/ReportsPage";
import ImagePage from "./pages/ImagePage";
import { useState, useEffect, useCallback } from "react";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";

export type UserType = {
  id: number,
  fullName: string,
  status: string,
  email: string,
  password: string,
  images: string[],
  reports: string[]
}

const App = () => {
  // Пользователи из базы данных
  const [users, setUsers] = useState<UserType[]>([]);
  // Сохраненный в локальном хранилище пользователь
  const savedUser = localStorage.getItem('logUser'); 
  // Пользователь по умолчанию (никто не вошел в систему)
  const nullUser = {
    id: 0,
    fullName: "",
    status: "",
    email: "",
    password: "",
    images: [],
    reports: [],
  }

  // Данные вошедшего пользователя
  const [logUser, setLogUser] = useState<UserType>(savedUser ? JSON.parse(savedUser) : nullUser);
  // Проверка на вход
  const [isEntered, setIsEntered] = useState(localStorage.getItem('isEntered') === 'true');
  // Проверка на регистрацию
  const [isRegistered, setIsRegistered] = useState(true);
  // URL для backend
  const apiUrl = import.meta.env.VITE_API_URL

  // Функция загрузки пользователей с backend
  const fetchUsers = useCallback (async () => {
    try {
      const response = await fetch(`${apiUrl}/users/`);
      const data: UserType[] = await response.json();
      setUsers(data);
    } catch {
      console.log("Ошибка при загрузке данных!");
    };
  }, [apiUrl]);

  useEffect(() => {  
    fetchUsers();
  }, [fetchUsers]);

  if (!isRegistered) {
    return (
      <div className="wrapper">
        <RegisterForm
          fetchUsers={fetchUsers}
          setIsRegistered={setIsRegistered}
          users={users}
          apiUrl={apiUrl}
        />
      </div>
    );
  }

  if (!isEntered) {
    return (
      <div className="wrapper">
        <LoginForm
          users={users}
          logUser={logUser}
          setLogUser={setLogUser}
          nullUser={nullUser}
          setIsEntered={setIsEntered}
          setIsRegistered={setIsRegistered}
        />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="account">
        <Header />
        <Routes>
          <Route path="/"
            element={
              <ImagePage
                logUser={logUser}
                setLogUser={setLogUser}
                fetchUsers={fetchUsers}
                apiUrl={apiUrl}
              />
            }
          />
          <Route path="/reports"
            element={
              <ReportsPage
                logUser={logUser}
                apiUrl={apiUrl}
              />
            }
          />
          <Route path="/profile"
            element={
              <AccountPage
                logUser={logUser}
                setLogUser={setLogUser}
                setIsEntered={setIsEntered}
                nullUser={nullUser}
                fetchUsers={fetchUsers}
                apiUrl={apiUrl}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;