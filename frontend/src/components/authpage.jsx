import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
} from "../service/auth";
import "../index.css";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/Home");
  };

  // 新規登録ボタン押下時は"/signup"にリダイレクト
  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await signInWithEmail(email, password);
      setUser(loggedInUser);
      handleHome();
    } catch (error) {
      alert(`サインインに失敗しました: ${error.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const googleUser = await signInWithGoogle();
      setUser(googleUser);
      handleHome();
    } catch (error) {
      alert(`Googleでのサインインに失敗しました: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      alert(`サインアウトに失敗しました: ${error.message}`);
    }
  };

  return (
    // 全体の背景色を bg-pink-100 に変更
    <div className="min-h-screen flex items-center justify-center bg-pink-100">
      {/* コンテナの背景色を bg-pink-50 に変更 */}
      <div className="w-full max-w-md bg-pink-50 shadow-md rounded-2xl p-8 border border-pink-200">
        {/* ヘッダー部分 */}
        <div className="mb-6 text-center">
          <img
            src="images/1.png"
            alt="あなたの会社"
            className="mx-auto h-24 w-24 rounded-full border-2 border-pink-300"
          />
          <h2 className="mt-4 text-2xl font-bold text-pink-600">
            アカウントにサインイン
          </h2>
        </div>

        {/* サインインフォーム */}
        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-pink-700"
            >
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1 block w-full px-4 py-2 border border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-pink-700"
            >
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-1 block w-full px-4 py-2 border border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-pink-500 hover:text-pink-600"
              >
                パスワードをお忘れですか？
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-pink-400 text-white rounded-full hover:bg-pink-500 transition duration-200"
          >
            サインイン
          </button>
        </form>

        {/* その他のアクション */}
        <div className="mt-6">
          <p className="text-center text-sm text-pink-600">
            まだメンバーではありませんか？アカウントを作成してください
          </p>
          <div className="mt-4 flex flex-col space-y-3">
            {/* 新規登録ボタン（背景を白に変更） */}
            <button
              onClick={handleSignUp}
              className="w-full py-2 px-4 bg-white border border-pink-400 text-pink-400 rounded-full hover:bg-pink-400 hover:text-white transition duration-200"
            >
              新規登録
            </button>
            {/* Googleサインインボタン（背景を白に変更） */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-2 px-4 bg-white border border-pink-300 text-pink-600 rounded-full hover:bg-pink-50 transition duration-200 flex items-center justify-center"
            >
              {/* Googleのロゴ（SVG） */}
              <svg
                className="h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.34 0 5.99 1.14 7.81 2.8l5.72-5.72C33.11 3.81 28.1 2 24 2 14.62 2 6.61 7.2 2.59 14.28l6.71 5.22C10.63 14.2 16.8 9.5 24 9.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M46.07 24.55c0-1.64-.15-3.21-.42-4.73H24v8.97h12.53c-.55 2.97-2.2 5.48-4.69 7.17l7.42 5.75C43.42 38.08 46.07 32.43 46.07 24.55z"
                />
                <path
                  fill="#34A853"
                  d="M10.3 28.96a13.95 13.95 0 0 1 0-8.94l-6.71-5.22a23.93 23.93 0 0 0 0 19.38l6.71-5.22z"
                />
                <path
                  fill="#4285F4"
                  d="M24 46c5.94 0 10.93-1.97 14.57-5.34l-7.42-5.75a15.72 15.72 0 0 1-7.15 1.91 15.67 15.67 0 0 1-15.67-15.67c0-2.67.65-5.18 1.8-7.37l-6.71-5.22C7.22 8.96 0 16.54 0 24c0 7.46 7.22 15.04 15.67 15.04z"
                />
              </svg>
              Googleでサインイン
            </button>
            {user && (
              <button
                onClick={handleSignOut}
                className="w-full py-2 px-4 border border-red-400 text-red-400 rounded-full hover:bg-red-400 hover:text-white transition duration-200"
              >
                サインアウト
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
