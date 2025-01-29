# CrearSky - React + Vite + Go(仮)

偏頭痛とかを教えてくれます

## 注意
> [!WARNING]
> - WSLは使用しないでください
> - firebase cliへのlogin忘れずに

## プロジェクト解説
### ディレクトリ構造

 ClearSky/  
├── frontend/           # フロントエンド  
├── src/  
│   │   ├── components/    # UIコンポーネント  
│   │   │   ├── header.jsx  
│   │   │   ├── footer.jsx  
│   │   │   ├── dashboard.jsx  
│   │   │   └── authpage.jsx  
│   │   ├── providers/     # コンテキストプロバイダー  
│   │   │   └── authproviders.jsx  
│   │   ├── service/       # 外部サービス連携  
│   │   │   ├── auth.js     # Firebase認証  
│   │   │   └── firebase.js  # Firebase設定  
│   │   └── App.jsx         # アプリケーションのルート  
│   └── public/            # 静的ファイル  
│  
├── Taskfile.yml         # タスクランナー設定  
└── README.md            # プロジェクト説明  

### 主要機能

1. 認証機能  
* Firebase認証（メール/パスワード、Google）  
* 保護されたルート
* ログイン状態管理  
2. ルーティング  
* プロテクトルート（home）：認証済みユーザーのみ  
* パブリックルート（/）：ログインページ  
3. UI構成
* ダッシュボード：メインコンテンツ  
* ヘッダー：ナビゲーション  
* フッター：補足情報  
4. 開発環境  
* Vite + React  
* TailwindCSS  
* Firebase  
* Bun（パッケージマネージャー）  

## Setup

### インストール
#### Mac
miseを入れたらあとはよしなにやってくれます
- [mise](https://mise.jdx.dev/getting-started.html)

#### windows
手動デス
- **必須**
  - [Taskfile](https://taskfile.dev/installation/)
  - [Bun](https://bun.sh/)
- 任意
  - [Go](https://go.dev/)

### tailwindcss
```bash
# bun 使う方法もあるけど一旦 npm で
$ cd frontend
$ npm install -D tailwindcss postcss autoprefixer
$ npx tailwindcss init
```

### 実行

#### Mac
```shell
mise install
task pre
```

#### Windows
```shell
task pre
```

#### Dev
```shell
task dev
```
