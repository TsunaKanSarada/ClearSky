import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          {/* うさぎのロゴ */}
          <img src="../assets/rabbit-logo.png" alt="ロゴ" /> 
        </div>
        <nav className="nav">
          <ul>
            <li><a href="/">ホーム</a></li>
            <li><a href="/about">私たちについて</a></li>
            <li><a href="/service">サービス</a></li>
            <li><a href="/contact">お問い合わせ</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;