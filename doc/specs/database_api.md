# データベースAPI仕様書

このドキュメントでは、FirestoreデータベースAPIについて、仕様をまとめています。
`ClearSky/app/src/services/firestore/databaseAPI.js`

## データベースへの格納関数 


### 1. `createUserDocument()`

**機能:** 

* 新規ユーザーのドキュメントをFirestoreに作成します。
* ユーザーID (`uid`) をドキュメントに設定します。

**使用方法:**

```javascript
await createUserDocument();
```

**引数:**  なし

**戻り値:**  なし

**エラー処理:**

* ユーザーIDが取得できない場合は、エラーをスローします。
* ドキュメントの作成に失敗した場合は、エラーをスローします。

### 2. `storeFirstProfile(profileData)`

**機能:** 

* 初回登録時のプロフィール情報をFirestoreに格納します。
* `users` コレクションのユーザーIDに対応するドキュメントに、`name` と `character` を設定します。
* `profile` サブコレクションに、プロフィール情報を格納します。

**使用方法:**

```javascript
const profileData = {
  name: '山田太郎',
  character: 0, // 1: ハムスター, 2: 猫, 3: 犬, 4: ペンギン, 5: モモンガ, 6: コアラ, 7: うさぎ, 8: パンダ
  birthDate: new Date('1995-04-10'),
  gender: 0, // 0: 男性, 1: 女性, 2: その他
  heightCm: 175,
  weightKg: 60,
  DrinkingHabit: 1, // 0: 飲まない, 1: あまり飲まない, 3: よく飲む, 4: 頻繁に飲む
  smokingHabit: 0, // 0: 吸わない, 1: あまり吸わない, 3: よく吸う, 4: 頻繁に吸う
};

await storeFirstProfile(profileData);
```

**引数:**

* `profileData` (object):
    * `name` (string): ユーザー名
    * `character` (number): キャラクター
    * `birthDate` (Date): 生年月日
    * `gender` (number): 性別
    * `heightCm` (number): 身長 (cm)
    * `weightKg` (number): 体重 (kg)
    * `DrinkingHabit` (number): 飲酒習慣
    * `smokingHabit` (number): 喫煙習慣

**戻り値:**  なし

**エラー処理:**

* ユーザーIDが取得できない場合は、エラーをスローします。
* データの格納に失敗した場合は、エラーをスローします。


### 3. `storeUpdateProfile(profileData)`

**機能:** 

* プロフィール更新時の情報をFirestoreに格納します。
* `users` コレクションのユーザーIDに対応するドキュメントの `name` と `character` を更新します。
* `profile` サブコレクションのプロフィール情報を更新します。

**使用方法:**

```javascript
const profileData = {
  // ... (storeFirstProfile と同じ形式のデータ)
};

await storeUpdateProfile(profileData);
```

**引数:**  `storeFirstProfile` と同じ

**戻り値:**  なし

**エラー処理:**

* ユーザーIDが取得できない場合は、エラーをスローします。
* データの更新に失敗した場合は、エラーをスローします。


### 4. `storeSleepData(sleepData)`

**機能:** 

* 睡眠時間と入力時刻をFirestoreに格納します。
* `users` コレクションの `currentRecords.sleepHours` と `currentRecords.updatedAt` を更新します。
* `dailyRecords` サブコレクションに新しいドキュメントを作成し、睡眠時間と記録日時を格納します。

**使用方法:**

```javascript
const sleepData = {
  sleepHours: 7, // 睡眠時間
  createdDate: new Date(), // 記録作成日時
};

await storeSleepData(sleepData);
```

**引数:**

* `sleepData` (object):
    * `sleepHours` (number): 睡眠時間
    * `createdDate` (Date): 記録作成日時


**戻り値:**  なし

**エラー処理:**

* ユーザーIDが取得できない場合は、エラーをスローします。
* データの格納に失敗した場合は、エラーをスローします。



### 5. `storeLocation_WeatherData(location, weatherData)`


**機能:** 

* 取得した位置情報と天気データをFirestoreに格納します。
* `users` コレクションの `currentRecords.weather` を更新します。
* `dailyRecords` サブコレクションに新しいドキュメントを作成し、位置情報と天気データを格納します。

**使用方法:**

```javascript
const location = {
  latitude: 35.6895,
  longitude: 139.6917,
};

const weatherData = {
  forecastDate: new Date(),
  weatherCode: 0,
  temperatureMax: 25,
  // ... (その他の天気情報)
};

await storeLocation_WeatherData(location, weatherData);
```

**引数:**

* `location` (object):
    * `latitude` (number): 緯度
    * `longitude` (number): 経度
* `weatherData` (object):
    * `forecastDate` (Date): 予測日
    * `weatherCode` (number): 天気コード
    * `temperatureMax` (number): 最高気温
    * `temperatureMin` (number): 最低気温
    * `apparentTemperatureMax` (number): 体感最高気温
    * `apparentTemperatureMin` (number): 体感最低気温
    * `humidity` (number): 湿度
    * `pressure` (number): 気圧
    * `windSpeed` (number): 風速

**戻り値:**  なし

**エラー処理:**

* ユーザーIDが取得できない場合は、エラーをスローします。
* データの格納に失敗した場合は、エラーをスローします。


### 6. `storePredictionData(predictionData)`

**機能:**

* 予測AIの出力結果をFirestoreに格納します。
* `users` コレクションの `currentRecords.prediction` を更新します。
* `dailyRecords` サブコレクションに新しいドキュメントを作成し、予測データを格納します。

**使用方法:**

```javascript
const predictionData = {
    headacheLevel: 3,
    GeneratedDate: new Date(),
};

await storePredictionData(predictionData);
```

**引数:**

* `predictionData` (object):
        * `headacheLevel` (number): 予測された頭痛レベル
        * `GeneratedDate` (Date): 予測生成日時

**戻り値:** なし

**エラー処理:**

* ユーザーIDが取得できない場合は、エラーをスローします。
* データの格納に失敗した場合は、エラーをスローします。

### 7. `storeAssistantData(assistantData)`

**機能:**

* アシスタントAIの応答をFirestoreに格納します。
* `users` コレクションの `currentRecords.assistant` を更新します。
* `dailyRecords` サブコレクションに新しいドキュメントを作成し、アシスタントの応答を格納します。

**使用方法:**

```javascript
const assistantData = {
    emotion: "happy",
    comment: "今日も元気に過ごしましょう！",
    GeneratedDate: new Date(),
};

await storeAssistantData(assistantData);
```

**引数:**

* `assistantData` (object):
        * `emotion` (string): アシスタントの感情状態
        * `comment` (string): アシスタントのコメント
        * `GeneratedDate` (Date): 応答生成日時

**戻り値:** なし

**エラー処理:**

* ユーザーIDが取得できない場合は、エラーをスローします。
* データの格納に失敗した場合は、エラーをスローします。

### 8. `storeCommentData(commentData)`

**機能:**

* コメントAIの応答をFirestoreに格納します。
* `users` コレクションの `currentRecords.comment` を更新します。
* `dailyRecords` サブコレクションに新しいドキュメントを作成し、コメントを格納します。

**使用方法:**

```javascript
const commentData = {
    comment: "睡眠時間が十分取れていますね",
    GeneratedDate: new Date(),
};

await storeCommentData(commentData);
```

**引数:**

* `commentData` (object):
        * `comment` (string): AIが生成したコメント
        * `GeneratedDate` (Date): コメント生成日時

**戻り値:** なし

**エラー処理:**

* ユーザーIDが取得できない場合は、エラーをスローします。
* データの格納に失敗した場合は、エラーをスローします。

---
## データベースからの取得関数


### 1. `getCharacterInfo()`

**機能:**

* ユーザーのキャラクター情報を取得します。

**使用方法:**

```javascript
const characterInfo = await getCharacterInfo();
console.log(characterInfo); // 例: {character: 1}
```

**引数:** なし

**戻り値:**

* `Promise<{character: number}>`: キャラクター番号を含むオブジェクト。
    * `character` (number): キャラクター番号 (1: ハムスター, 2: 猫, 3: 犬, 4: ペンギン, 5: モモンガ, 6: コアラ, 7: うさぎ, 8: パンダ)。

**エラー処理:**

* ユーザーIDが取得できない場合は、エラーをスローします。
* ユーザードキュメントが存在しない場合は、エラーをスローします。

### 2. `getProfile()`

**機能:**

* ユーザーのプロフィール情報を取得します。

**使用方法:**

```javascript
const profile = await getProfile();
console.log(profile);
// 例:
// {
//   birthDate: Date,
//   gender: 0,
//   heightCm: 170,
//   weightKg: 65,
//   DrinkingHabit: 1,
//   smokingHabit: 0,
//   registeredAt: Date,
//   updatedAt: Date
// }
```

**引数:** なし

**戻り値:**

* `Promise<Object>`: プロフィール情報を含むオブジェクト。
    * `birthDate` (Date | null): 生年月日。
    * `gender` (number): 性別。
    * `heightCm` (number): 身長 (cm)。
    * `weightKg` (number): 体重 (kg)。
    * `DrinkingHabit` (number): 飲酒習慣。
    * `smokingHabit` (number): 喫煙習慣。
    * `registeredAt` (Date | null): 登録日時。
    * `updatedAt` (Date | null): 更新日時。

**エラー処理:**

* ユーザーIDが取得できない場合は、エラーをスローします。
* プロフィール情報が存在しない場合は、エラーをスローします。

### 3. `getLocation()`

**機能:**

* ユーザーの最新の天気情報から位置情報を取得します。

**使用方法:**

```javascript
const locationData = await getLocation();
console.log(locationData); // 例: { location: GeoPoint { latitude: 35.6895, longitude: 139.6917 } }
```

**引数:** なし

**戻り値:**

*  `Promise<{location: GeoPoint|null}>`: 位置情報（GeoPoint オブジェクト）。位置情報が存在しない場合は null。

**エラー処理:**
* ユーザーIDが取得できない場合はエラーをスローします。

### 4. `getWeatherForecast(startDate, days)`

**機能:**

* 指定された開始日以降の指定された日数分の気象予報を取得します。

**使用方法:**

```javascript
const startDate = new Date('2024-07-01');
const days = 7;
const weatherForecast = await getWeatherForecast(startDate, days);
console.log(weatherForecast);
/* 例:
[
  {
    date: 2024-07-01T00:00:00.000Z,
    weather: {
      location: GeoPoint,
      forecastDate: 2024-07-01T00:00:00.000Z,
      weatherCode: 0,
      temperatureMax: 28,
      temperatureMin: 22,
      apparentTemperatureMax: 30,
      apparentTemperatureMin: 24,
      humidity: 80,
      pressure: 1012,
      windSpeed: 5,
      uv: 7
    }
  },
  // ... 他の日付のデータ
]
*/
```

**引数:**

* `startDate` (Date): 取得を開始する日付。
* `days` (number): 取得する日数。

**戻り値:**

*   `Promise<Array<{date: Date, weather: Object}>>`: 指定された期間の気象予報データの配列。
    *   `date` (Date):  予報日
    * `weather` (Object):  気象情報オブジェクト
        *   `location`  (GeoPoint | null):  位置情報
        *   `forecastDate`  (Date | null):  予報日
        *   `weatherCode`  (number | null):  天気コード
        *   `temperatureMax`  (number | null):  最高気温
        *   `temperatureMin`  (number | null):  最低気温
        *   `apparentTemperatureMax`  (number | null):  体感最高気温
        *   `apparentTemperatureMin`  (number | null):  体感最低気温
        *   `humidity`  (number | null):  湿度
        *   `pressure` (number | null):  気圧
        *   `windSpeed` (number | null): 風速
        *   `uv` (number | null):  UVインデックス

**エラー処理:**

* Firestoreからのデータ取得中にエラーが発生した場合、エラーをスローします。

### 5. `getWeatherForDate(date)`

**機能:**

* 指定された日付の気象情報を取得します。

**使用方法:**

```javascript
const date = new Date('2024-07-03');
const weather = await getWeatherForDate(date);
console.log(weather);
/* 例:
{
  location: GeoPoint,
  forecastDate: 2024-07-03T00:00:00.000Z,
  weatherCode: 1,
  temperatureMax: 29,
  temperatureMin: 23,
  apparentTemperatureMax: 31,
  apparentTemperatureMin: 25,
  humidity: 82,
  pressure: 1010,
  windSpeed: 6,
  uv: 8
}
*/
```

**引数:**

* `date` (Date): 取得する気象情報の日付。

**戻り値:**

* `Promise<Object|null>`: 指定された日付の気象情報オブジェクト。該当するデータが存在しない場合は null。
    *   `location`  (GeoPoint | null):  位置情報
    *   `forecastDate`  (Date | null):  予報日
    *   `weatherCode`  (number | null):  天気コード
    *   `temperatureMax`  (number | null):  最高気温
    *   `temperatureMin`  (number | null):  最低気温
    *   `apparentTemperatureMax`  (number | null):  体感最高気温
    *   `apparentTemperatureMin`  (number | null):  体感最低気温
    *   `humidity`  (number | null):  湿度
    *   `pressure` (number | null):  気圧
    *   `windSpeed` (number | null): 風速
    *   `uv` (number | null):  UVインデックス

**エラー処理:**

* ユーザーIDが取得できない場合は、エラーをスローします。
* Firestoreからのデータ取得中にエラーが発生した場合、エラーをスローします。

### 6. `getSleepHistory(endDate, days)`

**機能:**

* 指定された開始日以前の指定された日数分の睡眠時間履歴を取得します。

**使用方法:**

```javascript
const endDate = new Date('2024-07-05');
const days = 3;
const sleepHistory = await getSleepHistory(endDate, days);
console.log(sleepHistory);
/* 例:
[
  { date: 2024-07-03T00:00:00.000Z, sleepHours: 7 },
  { date: 2024-07-04T00:00:00.000Z, sleepHours: 6 },
  { date: 2024-07-05T00:00:00.000Z, sleepHours: 8 }
]
*/
```

**引数:**

* `endDate` (Date): 取得期間の終了日。
* `days` (number): 取得する日数。

**戻り値:**

* `Promise<Array<{date: Date, sleepHours: number|null}>>`:  指定された期間の睡眠時間データの配列。
    *   `date`  (Date):  日付
    *   `sleepHours`  (number | null):  睡眠時間

**エラー処理:**

* Firestoreからのデータ取得中にエラーが発生した場合、エラーをスローします。

### 7. `getSleepForDate(date)`

**機能:**

* 指定された日付の睡眠時間を取得します。指定された日付が今日の場合は currentRecords から、そうでない場合は dailyRecords から取得します。

**使用方法:**

```javascript
const date = new Date('2024-07-04');
const sleepData = await getSleepForDate(date);
console.log(sleepData); // 例: { sleepHours: 6, date: 2024-07-04T00:00:00.000Z }
```

**引数:**

*   `date` (Date): 取得する睡眠時間の日付

**戻り値:**

*   `Promise<{sleepHours: number|null, date: Date|null}>`: 指定された日付の睡眠時間と、日付情報を含むオブジェクト
    *   `sleepHours`: 睡眠時間 (数値または null)。
    *   `date`: 今日の場合はupdatedAt(Date)、それ以外はcreatedDate(Date)。

**エラー処理:**
* ユーザーIDが取得できない場合、エラーをスローします。
* Firestoreからのデータ取得中にエラーが発生した場合、エラーをスローします。

### 8. `getHeadachePredictions(startDate, days)`

**機能:**

* 指定された開始日以降の指定された日数分の頭痛予測履歴を取得します。

**使用方法:**

```javascript
const startDate = new Date('2024-07-01');
const days = 5;
const headachePredictions = await getHeadachePredictions(startDate, days);
console.log(headachePredictions);
/* 例:
[
  {
    date: 2024-07-01T00:00:00.000Z,
    prediction: { headacheLevel: 2, GeneratedDate: 2024-07-01T00:00:00.000Z }
  },
  {
    date: 2024-07-02T00:00:00.000Z,
    prediction: { headacheLevel: 1, GeneratedDate: 2024-07-02T00:00:00.000Z }
  },
  // ... 他の日付のデータ
]
*/
```

**引数:**

* `startDate` (Date): 取得を開始する日付。
* `days` (number): 取得する日数。

**戻り値:**

* `Promise<Array<{date: Date, prediction: Object|null}>>`: 指定された期間の頭痛予測データの配列。
    *   `date`  (Date):  日付
    *   `prediction` (Object | null): 頭痛予測オブジェクト

**エラー処理:**

* Firestore からのデータ取得中にエラーが発生した場合にエラーをスローします。

### 9. `getLatestHeadachePrediction()`

**機能:**

* 最新の頭痛予測を取得します。

**使用方法:**

```javascript
const latestPrediction = await getLatestHeadachePrediction();
console.log(latestPrediction);
// 例: { headacheLevel: 3, GeneratedDate: 2024-07-05T10:00:00.000Z }
```

**引数:** なし

**戻り値:**

* `Promise<Object|null>`: 最新の頭痛予測オブジェクト。予測が存在しない場合は null。
    *   `headacheLevel`  (number | null):  頭痛レベル
    *   `GeneratedDate`  (Date | null):  予測生成日時

**エラー処理:**
* Firestoreからのデータ取得中にエラーが発生した場合、エラーをスローします。

### 10. `getLatestAssistantInfo()`

**機能:**

* 最新のAIアシスタント情報を取得します。

**使用方法:**

```javascript
const latestAssistantInfo = await getLatestAssistantInfo();
console.log(latestAssistantInfo);
// 例: { emotion: 'neutral', comment: '体調に気をつけてください', GeneratedDate: 2024-07-05T11:00:00.000Z }
```

**引数:** なし

**戻り値:**

*   `Promise<Object|null>`: 最新のAIアシスタント情報オブジェクト。アシスタント情報が存在しない場合は null。
    *   `emotion` (string | null):  AIアシスタントの感情
    *   `comment` (string | null): AIアシスタントのコメント
    *   `GeneratedDate` (Date | null): コメント生成日時

**エラー処理:**
* Firestoreからのデータ取得中にエラーが発生した場合、エラーをスローします。

### 11. `getLatestAIComments()`

**機能:**

* 最新のAIコメントを取得します。

**使用方法:**

```javascript
const latestComments = await getLatestAIComments();
console.log(latestComments);
// 例: { weather: '今日は晴れですね', condition: '水分補給を忘れずに', GeneratedDate: 2024-07-05T12:00:00.000Z }
```

**引数:** なし

**戻り値:**

*   `Promise<Object|null>`: 最新のAIコメントオブジェクト。コメントが存在しない場合は null。
    *    `weather` (string | null): 天気に関するコメント
    *   `condition` (string | null): 体調に関するコメント
    *   `GeneratedDate` (Date | null): コメント生成日時

**エラー処理:**
* Firestoreからのデータ取得中にエラーが発生した場合、エラーをスローします。

### 12. `getCurrentRecords()` (ヘルパー関数)

**機能:**

* ユーザーの最新レコード(currentRecords)を取得します。これは他の関数内で利用されるヘルパー関数です。

**引数:** なし

**戻り値:**

*   `Promise<Object>`: ユーザーの最新レコードオブジェクト。
    *   `sleepHours`: 睡眠時間 (数値または null)。
    *   `weather`: 天気情報オブジェクト (または null)。
        *   `location`: 位置情報 (GeoPoint オブジェクトまたは null)。
        *   `forecastDate`: 予報日 (Date オブジェクトまたは null)。
        *   `weatherCode`: 天気コード (数値または null)。
        *   `temperatureMax`: 最高気温 (数値または null)。
        *   `temperatureMin`: 最低気温 (数値または null)。
        *   `apparentTemperatureMax`: 体感最高気温 (数値または null)。
        *   `apparentTemperatureMin`: 体感最低気温 (数値または null)。
        *   `humidity`: 湿度 (数値または null)。
        *   `pressure`: 気圧 (数値または null)。
        *   `windSpeed`: 風速 (数値または null)。
        *   `uv`: UVインデックス (数値または null)。
    *   `ai`: AI関連情報オブジェクト (または null)。
        *   `prediction`: 頭痛予測オブジェクト (または null)。
            *   `headacheLevel`: 頭痛レベル (数値または null)。
            *   `GeneratedDate`: 予測生成日時 (Date オブジェクトまたは null)。
        *   `assistant`: AIアシスタント情報オブジェクト (または null)。
            *   `emotion`: AIアシスタントの感情 (数値または null)。
            *   `comment`: AIアシスタントのコメント (文字列または null)。
            *   `GeneratedDate`: コメント生成日時 (Date オブジェクトまたは null)。
        *   `comment`: AIコメントオブジェクト (または null)。
            *   `weather`: 天気に関するコメント (文字列または null)。
            *   `condition`: 体調に関するコメント (文字列または null)。
            *   `GeneratedDate`: コメント生成日時 (Date オブジェクトまたは null)。
    *   `updatedAt`: 最終更新日時 (Date オブジェクトまたは null)。
**エラー処理:**
* ユーザーIDが取得できない場合、エラーをスローします。
* ユーザードキュメントが存在しない場合、エラーをスローします。

### 13. `getDailyRecords(days, startDate, endDate)` (ヘルパー関数)

**機能:**

* 指定された日数分のデイリーレコードを取得するヘルパー関数。これは他の関数内で利用されるヘルパー関数です。

**引数:**

*   `days` (number): 取得する日数。
*   `startDate` (Date, optional): 取得するレコードの開始日
*   `endDate` (Date, optional): 取得するレコードの終了日

**戻り値:**

* `Promise<Array<Object>>`: デイリーレコードオブジェクトの配列。
    *   `id`: ドキュメントID (文字列)。
*   `createdDate`: レコード作成日時 (Date オブジェクトまたは null)。
    *   `sleepHours`: 睡眠時間 (数値または null)。
    *   `weather`: 天気情報オブジェクト (または null)。
    *     - `location`: 位置情報 (GeoPoint オブジェクトまたは null)。
    *     - `forecastDate`: 予報日 (Date オブジェクトまたは null)。
    *     - `weatherCode`: 天気コード (数値または null)。
    *     - `temperatureMax`: 最高気温 (数値または null)。
    *     - `temperatureMin`: 最低気温 (数値または null)。
    *     - `apparentTemperatureMax`: 体感最高気温 (数値または null)。
    *     - `apparentTemperatureMin`: 体感最低気温 (数値または null)。
    *     - `humidity`: 湿度 (数値または null)。
    *     - `pressure`: 気圧 (数値または null)。
    *     - `windSpeed`: 風速 (数値または null)。
    *     - `uv`: UVインデックス (数値または null)。
    *   - `ai`: AI関連情報オブジェクト (または null)。
    *     - `prediction`: 頭痛予測オブジェクト (または null)。
    *       - `headacheLevel`: 頭痛レベル (数値または null)。
    *       - `GeneratedDate`: 予測生成日時 (Date オブジェクトまたは null)。
    *     - `assistant`: AIアシスタント情報オブジェクト (または null)。
    *       - `emotion`: AIアシスタントの感情 (数値または null)。
    *       - `comment`: AIアシスタントのコメント (文字列または null)。
    *       - `GeneratedDate`: コメント生成日時 (Date オブジェクトまたは null)。
    *     - `comment`: AIコメントオブジェクト (または null)。
    *       - `weather`: 天気に関するコメント (文字列または null)。
    *       - `condition`: 体調に関するコメント (文字列または null)。
    *       - `GeneratedDate`: コメント生成日時 (Date オブジェクトまたは null)。

**エラー処理:**

* ユーザーIDが取得できない場合、エラーをスローします。
* Firestore からのデータ取得中にエラーが発生した場合、エラーをスローします。

---

**補足**

*   各取得関数は、`async` で定義されているため、`await` キーワードを使って呼び出す必要があります。
*   Firestoreのデータ型 (`GeoPoint`, `Timestamp`) を使用しています。取得時にはJavaScriptの `Date` オブジェクトや数値型に変換されます。
*   各関数は、エラー処理を実装しており、エラー発生時にはコンソールにエラーメッセージを出力し、エラーをスローします。
*   ヘルパー関数 (`getCurrentRecords`, `getDailyRecords`) は、他の関数から利用されることを想定しており、直接アプリケーションのUIからは呼び出されないことを想定しています。

**その他**

*   このドキュメントは、上記の関数を使用するための基本的な情報を提供するものです。
*   より詳細な情報については、Firestoreの公式ドキュメントを参照してください。
*   `export.js` には、今後さらに取得関数が追加される可能性があります。
