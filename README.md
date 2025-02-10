# CrearSky

CrearSkyは、偏頭痛の予測や健康状態の管理をサポートするアプリケーションです。ユーザーは日々の健康データを入力し、アプリが提供する予測情報を活用することで、より良い生活習慣を築くことができます。

## プロジェクト解説

### ディレクトリ構造

```
app
├── index.html
├── src
│   ├── App.jsx
│   ├── main.jsx
│   ├── assets/
│   ├── components
│   │   ├── RouteController.jsx // ルーティング
│   │   ├── authpage.jsx // 認証ページ
│   │   ├── footer.jsx // フッター
│   │   ├── header.jsx // ヘッダー
│   ├── index.css // インデックススタイル
│   ├── providers
│   │   └── authproviders.jsx // 認証プロバイダー
│   └── services
│       ├── auth.js // auth
│       ├── firebase.js // firebase api
│       └── firestoreAPI.js // firestore api
└── tailwind.config.js
```

### 主要機能

#### バックエンド・クラウドサービス

- **Firebase**  
  - **Firebase in VertexAI**: 各ページでVertexAI(momdel: Gemini 1.5-Pro, 1.5-flash)を呼び出し。片頭痛予測からアシスタントのコメント生成、気象情報の総括など一手に担う。
  - **Firestore**: サーバーレスなデータベースとして、リアルタイムデータの管理を容易にするために使用。  
  - **App Check**: 不正リクエスト対策として導入。  
  - **Firebase Authentication**: ユーザー認証を円滑に行うため採用。
  - **Cloud Functions**: Vertex AIの呼び出しにトリガーを設定するため採用。

#### フロントエンド

- **React**  
  ユーザーインターフェースの構築において、コンポーネントベースの設計と豊富なエコシステムを活用するため採用。

- **Vite**  
  高速な開発サーバーとビルドツールを提供するため、開発体験の向上を目的として選定。

- **Tailwind CSS**  
  効率的なスタイリングとカスタマイズ性を担保するため、ユーティリティクラスベースのCSSフレームワークを利用。

- **Firebase Web SDK**  
  Firebase AuthenticationやFirestoreなどと連携し、リアルタイムデータベースやセキュリティ機能を実装するために採用。

#### その他

- **bun**  
  高速なパッケージマネージャーとビルドツールを提供するため、開発体験の向上を目的として選定。

### 実行

```shell
bun init
bun install
bun dev
```