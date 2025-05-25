import { useState, type FC } from "react"

import type { UserType } from "../App"

type LoginFormProps = {
  users: UserType[],
  logUser: UserType,
  setLogUser: (user: UserType) => void,
  nullUser: UserType,
  setIsEntered: (bool: boolean) => void,
  setIsRegistered: (bool: boolean) => void
}

const LoginForm: FC<LoginFormProps> = ({ users, logUser, setLogUser, nullUser, setIsEntered, setIsRegistered }) => {

  // Ошибка входа в аккаунт
  const [loginError, setLoginError] = useState("");
  
  // Проверка логина и пароля, установка состояния при успешном входе
  const toEnter = () => {
    const foundUser = users.find(user => 
      user.email === logUser.email && user.password === logUser.password
    );
    if (foundUser) {
      setLogUser(foundUser);
      setIsEntered(true);
      localStorage.setItem("isEntered", 'true');
      localStorage.setItem("logUser", JSON.stringify(foundUser));
    } else {
      setLoginError("Неверный логин или пароль");
      setLogUser(nullUser);
      localStorage.removeItem("logUser");
    };
  };

  // Обработка изменения полей ввода и обновление состояния logUser
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogUser({ ...logUser, [e.target.name]: e.target.value });
  };
  
  return (
    <div className="enter-form">
      <div className="enter-background">
        <div className="enter-background-img" />
        <div className="radex-logo">
          RADEX
        </div>
        <img className="gazprom-logo" 
          src="public/images/gazprom-logo.png" 
        />
      </div>

      <div className="login-register-form">
        <div className="login-register-head">
          <div className="login-register-greet">
            Приветствуем в Radex
          </div>
          <div className="login-register-link">
            <div className="link-question">
              Нет аккаунта?
            </div>
            <div className="link-btn"
              onClick={() => setIsRegistered(false)}
            >
              Регистрация
            </div>
          </div>
          <div className="login-register-text">
            Вход
          </div>
        </div>

        <div className="login-register-input">
          <div className="input-text">
            Введите почту
          </div>
            <input className="input-form"
              type="email"
              name="email"
              placeholder="Почта"
              value={logUser.email}
              onChange={handleChange}
            />
          
          <div className="input-text">
            Введите пароль
          </div>
            <input className="input-form"
              type="password"
              name="password"
              placeholder="Пароль"
              value={logUser.password}
              onChange={handleChange}
            />
        </div>

        {loginError && 
          <div className="login-error">
            {loginError}
          </div>
        }

        <div className="enter-btn"
          onClick={toEnter}
        >
          Войти
        </div>
      </div>
    </div>
  );
};

export default LoginForm