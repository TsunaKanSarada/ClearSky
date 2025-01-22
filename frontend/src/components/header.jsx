import './header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          {/* うさぎのロゴ */}
          <img src="./image/rabbit-logo.png" alt="ロゴ" /> 
        </div>
        <nav className="nav">
          <ul>
            <li><a href="/">ホーム</a></li>
            <li><a href="/about">あなたの健康</a></li>
            <li><a href="/service">気象情報</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;