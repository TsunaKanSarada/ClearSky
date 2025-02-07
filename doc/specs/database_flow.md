# データフロー図

## この書類はなに？
本プロジェクトのDBはfirestoreを採用しており、非正規化の影響でデータの流れが非直感的です。  
データフローを明確にすることと、バックエンド側の作業用も兼ねて作成いたしました。

## データフロー図





## 作業用

### データ格納

```
└── users (コレクション)
    └── {userId} (ドキュメント)
        ├── userId (string) -> ✅Authで取得したユーザーID
        ├── name (string) -> ✅初回登録時 / プロフィール更新時に取得
        ├── character (number) -> ✅初回登録時 / プロフィール更新時に取得
        ├── currentRecords (map) 
        │   ├── sleepHours (number) -> ✅① 睡眠時間入力時
        │   ├── weather (map)
        │   │   ├── location (geopoint) -> ✅① Geolocation API で取得
        │   │   ├── forecastDate (timestamp) -> ✅① open-meteo API で取得
        │   │   ├── weatherCode (number) -> ✅〃
        │   │   ├── temperatureMax (number) -> ✅〃
        │   │   ├── temperatureMin (number) -> ✅〃
        │   │   ├── apparentTemperatureMax (number) -> ✅〃
        │   │   ├── apparentTemperatureMin (number) -> ✅〃
        │   │   ├── humidity (number) -> ✅〃
        │   │   ├── pressure (number) -> ✅〃
        │   │   ├── windSpeed (number) -> ✅〃
        │   │   └── uv (number) -> ✅① open-meteo API で取得
        │   ├── ai (map) 
        │   │   ├── prediction (map) 
        │   │   │   ├── headacheLevel (number) ① predictionAIから受け取り
        │   │   │   └── GeneratedDate (timestamp) ① 受け取り時に設定
        │   │   ├── assistant (map)
        │   │   │   ├── emotion (number) ① assistantAIから受け取り
        │   │   │   ├── comment (string) ① assistantAIから受け取り
        │   │   │   └── GeneratedDate (timestamp) ① 受け取り時に設定
        │   │   └── comment (map)
        │   │       ├── weather (string) ① commentAIから受け取り
        │   │       ├── condition (string) ① commentAIから受け取り
        │   │       └── GeneratedDate (timestamp) ① 受け取り時に設定
        │   └── updatedAt (timestamp) -> ✅① 睡眠時間入力時に設定
        │
        ├── ★profile (サブコレクション)
        │   ├── birthDate (timestamp) -> ✅初回登録時 / プロフィール更新時に取得
        │   ├── gender (number) -> ✅〃
        │   ├── heightCm (number) -> ✅〃
        │   ├── weightKg (number) -> ✅〃
        │   ├── DrinkingHabit (number) -> ✅〃
        │   ├── smokingHabit (number)  -> ✅〃
        │   ├── registeredAt (timestamp) -> ✅初回登録日時を設定
        │   └── updatedAt  (timestamp) -> ✅初回登録時日時 / プロフィール更新日時を設定
        │
        └── dailyRecords (サブコレクション)
            ├── sleepHours (number) -> ✅② アンケート入力時？
            ├── weather (map)
            │   ├── location (geopoint) -> ✅② Geolocation API で取得
            │   ├── forecastDate (timestamp) -> ✅② open-meteo API で取得
            │   ├── weatherCode (number) -> ✅〃
            │   ├── temperatureMax (number) -> ✅〃
            │   ├── temperatureMin (number) -> ✅〃
            │   ├── apparentTemperatureMax (number) -> ✅〃
            │   ├── apparentTemperatureMin (number) -> ✅〃
            │   ├── humidity (number) -> ✅〃
            │   ├── pressure (number) -> ✅〃
            │   ├── windSpeed (number) -> ✅〃
            │   └── uv (number) -> ✅② open-meteo API で取得
            ├── ai (map) ※ ② 別ファイルにて受け取り
            │   ├── prediction (map)
            │   │   ├── headacheLevel (number) ② predictionAIから受け取り
            │   │   └── GeneratedDate (timestamp) ② 受け取り時に設定
            │   ├── assistant (map)
            │   │   ├── emotion (number) ② assistantAIから受け取り
            │   │   ├── comment (string) ② assistantAIから受け取り
            │   │   └── GeneratedDate (timestamp) ② 受け取り時に設定
            │   └── comment (map)
            │       ├── weather (string) ② commentAIから受け取り
            │       ├── condition (string) ② commentAIから受け取り
            │       └── GeneratedDate (timestamp) ② 受け取り時に設定
            └── createdDate (timestamp) -> ✅② 睡眠時間入力時に設定
```

### データ出力

```
※AI出力情報は全て日時(GeneratedAt)も返す

・ユーザーのキャラクター情報 (単体で取得)
・プロフィール情報 (ユーザーのキャラクター情報も含む)
・位置情報 (単体で取得) 最新の情報を返す

・気象情報 - 指定日から先の、指定した日数分 (dailyRecordsのweather)
・気象情報 - １日分 (currentRecordのweather) -> 指定した日付の情報を返す

(記録型データのため、遡りで取得)
・睡眠時間と入力日時 - 指定日から遡り、指定した日数分 (sleepHours, createdAt)
・睡眠時間と入力日時 - １日分 (sleepHours, updatedAt) 指定した日付の情報を返す

・偏頭痛レベル (predictionAI) - 指定日から先の、指定した日数分 (dailyRecordsのai)
・偏頭痛レベル (predictionAI) - １日分 (currentRecordのai)

・ユーザーの調子とコメント (一括でOK) (assistantAI) 最新の情報を返す
・ユーザーの短文体調コメント (commentAI) 最新の情報を返す
・気象情報への短文AIコメント (commentAI) 最新の情報を返す
```


### 必要なデータ>

```
~playRoom~

・ユーザーのキャラクター情報
・ユーザーの短文体調コメント

<commentAIに渡すデータ>
・アシスタントAIの持つユーザーの調子とコメント (assistantAI -> commentAI)


~assistant~

・ユーザーのキャラクター情報
・アシスタントAIの持つユーザーの調子とコメント

<predictionAIに渡すデータ>
・気象情報 (7日分)
・ユーザー情報 (profile)
・睡眠時間

<assistantAIに渡すデータ>
・片頭痛レベル (predictionAI -> assistantAI) (1日分)


~infoPage~
・ユーザーのキャラクター情報
・気象情報への短文AIコメント
・気象情報 (7日分)
・睡眠時間 (7日分)
・偏頭痛レベル (predictionAI) (7日分)

<commentAIに渡すデータ>
・気象情報 (7日分)
```