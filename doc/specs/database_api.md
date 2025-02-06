# データベースAPI仕様書

このドキュメントでは、Firestoreデータベース操作の関数について、仕様をまとめています。

## データベースへの格納関数 

`ClearSky/app/src/services/firestore/import.js`



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
  character: 0, // 0: ハムスター, 1: モモンガ, 2: 猫
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



**補足**

* 各関数は、`async` で定義されているため、`await` キーワードを使って呼び出す必要があります。
* Firestoreのデータ型 (`GeoPoint`, `Timestamp`) を使用しています。
* 各関数は、エラー処理を実装しており、エラー発生時にはコンソールにエラーメッセージを出力し、エラーをスローします。

**その他**

* このドキュメントは、上記の関数を使用するための基本的な情報を提供するものです。
* より詳細な情報については、Firestoreの公式ドキュメントを参照してください。
