import { useState, type FC } from "react"
import type { UserType } from "../App"

type RegisterFormProps = {
    fetchUsers: () => void,
    setIsRegistered: (bool: boolean) => void,
    users: UserType[],
    apiUrl: string
}

const RegisterForm: FC<RegisterFormProps> = ({ fetchUsers, setIsRegistered, users, apiUrl }) => {

  // Новый пользователь
  const [newUser, setNewUser] = useState<Omit<UserType, "id">>({
    fullName: "",
    status: "",
    email: "",
    password: "",
    images: [],
    reports: [],
  });
  
  // Ошибка при регистрации
  const [registerError, setRegisterError] = useState("");
  
  // Обработка изменения полей ввода и обновление состояния newUser
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };
  
  // Регистрация нового пользователя
  const toRegister = async () => {
    if (!newUser.fullName || !newUser.status || !newUser.email || !newUser.password) {
      setRegisterError("Пожалуйста, заполните все поля");
      return;
    };

    if (users.some(user => user.email === newUser.email)) {
      setRegisterError("Пользователь с такой почтой уже существует");
      return;
    };
    
    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error("Ошибка при регистрации");
      fetchUsers();
      setIsRegistered(true);
      localStorage.removeItem("uploadedImagePath");
      } catch (err) {
        console.error(err);
        setRegisterError("Ошибка при регистрации");
      };
  };
  
  return (
    <div className="enter-form">
      <div className="enter-background">
        <div className="enter-background-img" />
        <div className="radex-logo">
          RADEX
        </div>
        <img className="gazprom-logo" 
          src="/images/gazprom-logo.png" 
        />
      </div>

      <div className="login-register-form">
        <div className="login-register-head">
          <div className="login-register-greet">
            Приветствуем в Radex
          </div>
          <div className="login-register-link">
            <div className="link-question">
              Есть аккаунт?
            </div>
            <div className="link-btn"
              onClick={() => setIsRegistered(true)}
            >
              Войти
            </div>
          </div>
          <div className="login-register-text">
            Регистрация
          </div>
        </div>

        <div className="login-register-input">
          <div className="input-text">
            Введите ФИО
          </div>
          <input className="input-form"
            type="text"
            name="fullName"
            placeholder="ФИО"
            value={newUser.fullName}
            onChange={handleChange}
          />

          <div className="double-input">
            <div>
              <div className="input-text">
                Введите почту
              </div>
              <input className="input-form-small"
                type="email"
                name="email"
                placeholder="Почта"
                value={newUser.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <div className="input-text">
                Введите должность
              </div>
              <input className="input-form-small"
                type="text"
                name="status"
                placeholder="Должность"
                value={newUser.status}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-text">
            Введите пароль
          </div>
          <input className="input-form"
            type="password"
            name="password"
            placeholder="Пароль"
            value={newUser.password}
            onChange={handleChange}
          />
        </div>

        {registerError && 
          <div className="login-error">
            {registerError}
          </div>
        }

        <div className="register-btn"
          onClick={toRegister}
        >
          Зарегистрироваться
        </div>
      </div>
    </div>
  );
};

export default RegisterForm