# データベース設計書

## 1. データベース概要

* データベース名: clearsky-db
* データベースの種類: NoSQL
* 使用DBMS: Cloud Firestore
* 設計方針: 
    * データの非正規化を許容する
    * クエリのパフォーマンスを考慮してインデックスを設計する

## 2. コレクション設計

| コレクション名 | 説明 |
|---|---|
| users | ユーザー情報を格納 |
| weatherData | APIから取得した気象情報等を格納 |
| ai | AI情報を格納|

## 3. ドキュメント定義

### `users`コレクション

| フィールド名 | データ型 | 説明 |
|---|---|---|
| userId | string | ユーザーID (Firebase Authentication UID) |
| name | string | ユーザー名 |

#### `profile`サブコレクション -> 固定値

| フィールド名 | データ型 | 説明 |
|---|---|---|
| birthDate | timestamp | 生年月日 |
| gender | number | 性別 (0: 男性, 1: 女性, 2: その他)|
| character | number | キャラクター (0: ハムスター, 1: モモンガ, 2: 猫) |
| registeredAt | timestamp | 登録日時 |
| updatedAt | timestamp | 最終更新日時 |

#### `health`サブコレクション -> 固定値
| フィールド名 | データ型 | 説明 |
|---|---|---|
| heightCm | number | 身長（cm） |
| weightKg | number | 体重（kg） |
| drinkingHabit | string | 飲酒習慣（none|light|moderate|heavy） |
| smokingStatus | string | 喫煙習慣（none|light|moderate|heavy） |
| registeredAt | timestamp | 登録日時 |
| updatedAt | timestamp | 最終更新日時 |

#### `dailyStatus`サブコレクション -> 可変値
| フィールド名 | データ型 | 説明 |
|---|---|---|
| location | geopoint | 位置情報 | -> 気象情報に使用
| sleepHours | number | その日の睡眠時間 |
| createdDate | timestamp | 記録作成日時 |

---
### `weatherData`コレクション

| フィールド名 | データ型 | 説明 |
|---|---|---|
| location | geopoint | 位置情報 | => dailyStatus サブコレクションと連携
| forecastDate | timestamp | 記録日時 |
| weatherCode | number | 天気コード (0: 晴れ ~ 99: 雷雨)|
| temperatureMax | number | 最高気温 |
| temperatureMin | number | 最低気温 |
| apparentTemperatureMax | number | 体感最高気温 |
| apparentTemperatureMin | number | 体感最低気温 |
| humidity | number | 湿度 |
| pressure | number | 気圧 |
| windSpeed | number | 風速 |


---
### `ai`コレクション

| フィールド名 | データ型 | 説明 |
|---|---|---|
| recordId | string | 健康記録ID |
| userId | string | ユーザーID |
| GeneratedDate | timestamp | 生成日時 |

#### `predictionAI`サブコレクション　-> 予測AI

| フィールド名 | データ型 | 説明 |
|---|---|---|
| headacheLevel | number | 片頭痛の程度 (0-10) |

#### `assistantAI`サブコレクション -> アシスタントAI
| フィールド名 | データ型 | 説明 |
|---|---|---|
| emotion | number | 感情ステータス (0: happy, 1: sad, 2: angry) |
| comment | String | ユーザーへのコメント |

#### `commentAI`サブコレクション -> 短文コメントAI
| フィールド名 | データ型 | 説明 |
|---|---|---|
| weather | string | 気象情報に対してのコメント | -> infoページに表示
| condition | String | ユーザーの体調コメント | -> playRoomページに表示

## 4. データ構造図


```mermaid
%% Top-Bottom形式で表示
flowchart TB

  %% usersコレクション
  subgraph users
    user_id[userId]
    user_name[name]

    %% profileサブコレクション
    subgraph profile
      birth_date[birthDate]
      user_gender[gender]
      character[character]
      profile_registered[registeredAt]
      profile_updated[updatedAt]
    end

    %% healthサブコレクション
    subgraph health
      height[heightCm]
      weight[weightKg]
      drinking[drinkingHabit]
      smoking[smokingStatus]
      health_registered[registeredAt]
      health_updated[updatedAt]
    end

    %% dailyStatusサブコレクション
    subgraph dailyStatus
      user_location[location]
      sleep[sleepHours]
      daily_created[createdDate]
    end
  end

  %% weatherDataコレクション
  subgraph weatherDate
    weather_location[location]
    forecast[forecastDate]
    weather_code[weatherCode]
    temp_max[temperatureMax]
    temp_min[temperatureMin]
    app_temp_max[apparentTemperatureMax]
    app_temp_min[apparentTemperatureMin]
    humid[humidity]
    press[pressure]
  end

  %% aiコレクション
  subgraph ai
    record_id[recordId]
    ai_user_id[userId]
    generated[GeneratedDate]

    %% predictionAIサブコレクション
    subgraph prediction
      headache[headacheLevel]
    end

    %% assistantAIサブコレクション
    subgraph assistant
      mood[emotion]
      ai_comment[comment]
    end

    %% commentAIサブコレクション
    subgraph comment
      info_comment[weather]
      shown_comment[condition]
    end
  end

```

* `dailyStatus` サブコレクションと `weatherData` コレクションは、locationで関連付け
* `weatherData` コレクション の情報は `predictionAI`, `commentAI` サブコレクションへ送信


## 5. その他

* セキュリティルール: 各コレクションに対して、Firebase Authentication を使用したアクセス制御を行う。


## ６. 更新履歴

* 2024/02/03: 初版作成
* 2025/02/05: 第2版作成  
  * `weatherData`コレクションを`open-meteo`APIに最適化  
  * `weatherData`コレクションから花粉情報(`pollen`関連)を削除  
  * `users` -> `profile`サブコレクションに`character`を追記  
  * `ai` -> `assistantAI`, `commentAI`サブコレクションを追記  