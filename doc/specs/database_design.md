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
| aiInteractions | AI情報を格納|

## 3. ドキュメント定義

### users コレクション

| フィールド名 | データ型 | 説明 |
|---|---|---|
| userId | string | ユーザーID (Firebase Authentication UID) |
| name | string | ユーザー名 |

#### profile サブコレクション -> 固定値

| フィールド名 | データ型 | 説明 |
|---|---|---|
| birthDate | timestamp | 生年月日 |
| gender | string | 性別 |
| registeredAt | timestamp | 登録日時 |
| updatedAt | timestamp | 最終更新日時 |

#### health サブコレクション -> 固定値
| フィールド名 | データ型 | 説明 |
|---|---|---|
| heightCm | number | 身長（cm） |
| weightKg | number | 体重（kg） |
| drinkingHabit | string | 飲酒習慣（none|light|moderate|heavy） |
| smokingStatus | string | 喫煙習慣（none|light|moderate|heavy） |
| registeredAt | timestamp | 登録日時 |
| updatedAt | timestamp | 最終更新日時 |

#### dailyStatus サブコレクション -> 可変値
| フィールド名 | データ型 | 説明 |
|---|---|---|
| location | geopoint | 位置情報 | -> 気象情報に使用
| sleepHours | number | その日の睡眠時間 |
| createdDate | timestamp | 記録作成日時 | ※可変値だからあっても良い気がするけど...？

---
### weatherData コレクション -> 今は一元化しているが、APIが増えたらサブコレクションに細分化？

| フィールド名 | データ型 | 説明 |
|---|---|---|
| location | geopoint | 位置情報 | => dailyStatus サブコレクションと連携
| forecastDate | timestamp | 記録日時 |
| temperature | number | 気温 |
| humidity | number | 湿度 |
| pressure | number | 気圧 |
| weather | string | 天気 |
| pollenLevel | number | 花粉レベル |
| pollenType | string | 花粉の種類 |


---
### aiInteractions コレクション

| フィールド名 | データ型 | 説明 |
|---|---|---|
| recordId | string | 健康記録ID |
| userId | string | ユーザーID |
| GeneratedDate | timestamp | 生成日時 |

#### predictionAI サブコレクション　-> 予想AI

| フィールド名 | データ型 | 説明 |
|---|---|---|
| headacheLevel | number | 片頭痛の程度 (0-10) |
| pollinosisLevel | number | 花粉症の程度 (0-10) |

#### commentAI サブコレクション -> コメントAI
| フィールド名 | データ型 | 説明 |
|---|---|---|
| emotion | string | 感情ステータス (happy|normal|sad|angry) |
| comment | String | ユーザーへのコメント |


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
    temp[temperature]
    humid[humidity]
    press[pressure]
    weather_status[weather]
    pollen_level[pollenLevel]
    pollen_type[pollenType]
  end

  %% aiInteractionsコレクション
  subgraph ai
    record_id[recordId]
    ai_user_id[userId]
    generated[GeneratedDate]

    %% predictionAIサブコレクション
    subgraph prediction
      headache[headacheLevel]
      pollen[pollinosisLevel]
    end

    %% commentAIサブコレクション
    subgraph comment
      mood[emotion]
      ai_comment[comment]
    end
  end


  user_location[location] --- weather_location[location]
```

* dailyStatus サブコレクションと weatherData コレクションは、locationで関連付け
* weatherData コレクション の情報は predictionAI サブコレクションへ送信


## 5. その他

* インデックス: healthRecords コレクションの userId、date、headacheLevel、pollenLevel にインデックスを作成する。
* セキュリティルール: 各コレクションに対して、Firebase Authentication を使用したアクセス制御を行う。


## 7. 更新履歴

* 2024/02/03: 初版作成 → 熱中症やカレンダー情報などは未定義