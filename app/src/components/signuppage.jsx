import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpWithEmail } from "../services/auth";
import "../index.css";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // パスワードの確認用フィールドを追加
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    // パスワードと確認パスワードが一致しているかチェック
    if (password !== confirmPassword) {
      alert("パスワードが一致しません");
      return;
    }
    try {
      const newUser = await signUpWithEmail(email, password);
      // 登録成功後、ホームページへリダイレクト（必要に応じてルートは変更してください）
      navigate("/regi");
    } catch (error) {
      alert(`サインアップに失敗しました: ${error.message}`);
    }
  };

  // ログインページへ戻るためのハンドラー
  const handleReturnToLogin = () => {
    navigate("/");
  };

  return (
    // 背景色を bg-pink-100 に変更
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
            新規登録
          </h2>
        </div>

        {/* 新規登録フォーム */}
        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-pink-700">
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
            <label htmlFor="password" className="block text-sm font-medium text-pink-700">
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="mt-1 block w-full px-4 py-2 border border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-pink-700">
              パスワード確認
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="mt-1 block w-full px-4 py-2 border border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-pink-400 text-white rounded-full hover:bg-pink-500 transition duration-200"
          >
            サインアップ
          </button>
        </form>

        {/* ログインページへ戻るボタン */}
        <button
          type="button"
          onClick={handleReturnToLogin}
          className="mt-4 w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition duration-200"
        >
          ログインページへ戻る
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
