/* APIやフロントからの情報をデータベースに格納するファイル
(AIからの情報は別で受け取り、データベースに格納する -> その際はDBからのデータをインポート)

<必要データの取得方法>

└── users (コレクション)
    └── {userId} (ドキュメント)
        ├── userId (string) -> Authで取得したユーザーID
        ├── name (string) -> サインアップ時に取得？
        ├── character (number) -> サインアップ時に取得？
        ├── currentRecords (map) 
        │   ├── location (geopoint) -> ① Geolocation API で取得(アンケート入力時？)
        │   ├── sleepHours (number) -> ① 睡眠時間入力時
        │   ├── weather (map)
        │   │   ├── location (geopoint) -> ② Geolocation API で取得(アンケート入力時？)
        │   │   ├── forecastDate (timestamp) -> ① open-meteo API で取得
        │   │   ├── weatherCode (number) -> 〃
        │   │   ├── temperatureMax (number) -> 〃
        │   │   ├── temperatureMin (number) -> 〃
        │   │   ├── apparentTemperatureMax (number) -> 〃
        │   │   ├── apparentTemperatureMin (number) -> 〃
        │   │   ├── humidity (number) -> 〃
        │   │   ├── pressure (number) -> 〃
        │   │   └── windSpeed (number) -> ① open-meteo API で取得
        │   ├── ai (map) ※ ① 別ファイルにて受け取り
        │   │   ├── prediction (map)
        │   │   │   ├── headacheLevel (number)
        │   │   │   └── GeneratedDate (timestamp)
        │   │   ├── assistant (map)
        │   │   │   ├── emotion (number)
        │   │   │   ├── comment (string)
        │   │   │   └── GeneratedDate (timestamp)
        │   │   └── comment (map)
        │   │       ├── weather (string)
        │   │       ├── condition (string)
        │   │       └── GeneratedDate (timestamp)
        │   └── updatedAt (timestamp) -> ① 睡眠時間入力時に設定
        │
        ├── ★profile (サブコレクション)
        │   ├── birthDate (timestamp) -> サインアップ時に取得
        │   ├── gender (number) -> 〃
        │   ├── heightCm (number) -> 〃
        │   ├── weightKg (number) -> 〃
        │   ├── DrinkingHabit (number) -> 〃
        │   ├── smokingHabit (number)  -> 〃
        │   ├── registeredAt (timestamp) -> 日時を設定
        │   └── updatedAt  (timestamp) -> 日時を設定
        │
        └── dailyRecords (サブコレクション)
            ├── location (geopoint) -> ③ Geolocation API で取得(アンケート入力時？)
            ├── sleepHours (number) -> ② アンケート入力時？
            ├── weather (map)
            │   ├── location (geopoint) -> ④ Geolocation API で取得(アンケート入力時？)
        │   │   ├── forecastDate (timestamp) -> ② open-meteo API で取得
        │   │   ├── weatherCode (number) -> 〃
        │   │   ├── temperatureMax (number) -> 〃
        │   │   ├── temperatureMin (number) -> 〃
        │   │   ├── apparentTemperatureMax (number) -> 〃
        │   │   ├── apparentTemperatureMin (number) -> 〃
        │   │   ├── humidity (number) -> 〃
        │   │   ├── pressure (number) -> 〃
        │   │   └── windSpeed (number) -> ② open-meteo API で取得
            ├── ai (map) ※ ② 別ファイルにて受け取り
            │   ├── prediction (map)
            │   │   ├── headacheLevel (number)
            │   │   └── GeneratedDate (timestamp)
            │   ├── assistant (map)
            │   │   ├── emotion (number)
            │   │   ├── comment (string)
            │   │   └── GeneratedDate (timestamp)
            │   └── comment (map)
            │       ├── weather (string)
            │       ├── condition (string)
            │       └── GeneratedDate (timestamp)
            └── createdDate (timestamp) -> ② 睡眠時間入力時に設定


*/


// Authで取得 (userId)


/* サインアップ時のデータを取得 (日時も取得)
(name, character, birthDate, gender, heightCm, weightKg, 
DrinkingHabit, smokingHabit, registeredAt, updatedAt) */



// ①~④ Geolocation APIで取得 (location) ⭐️フラグも設定(Gemini相談)


/* ①~② 睡眠時間入力時に取得 + (日時も取得)
(sleepHours, ①updatedAt, ②CreatedDate) */



/* ①~② open-meteo APIで取得 
(forecastDate, weatherCode, temperatureMax, temperatureMin, 
apparentTemperatureMax, apparentTemperatureMin, humidity, pressure, windSpeed) */

