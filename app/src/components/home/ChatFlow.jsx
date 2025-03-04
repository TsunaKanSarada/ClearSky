import React, { useEffect, useRef, useState } from "react";
import Dashboard from "./animation";
import Comment from "./comment";

const ChatFlow = ({ data }) => {
  // data: {"こんにちは":1,"おはよう":2} のようなオブジェクト
  // まずキーと値のペアを配列化して管理する
  const messages = Object.entries(data);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [showComment, setShowComment] = useState(false);

  // animation.jsx のメソッドを呼び出すための Ref
  const dashboardRef = useRef(null);

  // メッセージの切り替えと各種アニメーションの実行
  useEffect(() => {
    // まだ表示していないメッセージがあれば処理する
    if (currentIndex < messages.length) {
      const [text, code] = messages[currentIndex];
      setCurrentText(text); // アニメーション対象のテキストを更新

      // アニメーションの時間（ここを一律7秒に設定）
      const duration = 7000;

      if (dashboardRef.current) {
        switch (code) {
          case 0: {
            // handleBounce or handleJello をランダムに呼び出し
            const random = Math.random() < 0.5;
            if (random) {
              dashboardRef.current.handleBounce();
            } else {
              dashboardRef.current.handleJello();
            }
            break;
          }
          case 1: {
            // handlePoyon or handleJoy をランダムに呼び出し
            const random = Math.random() < 0.5;
            if (random) {
              dashboardRef.current.handlePoyon();
            } else {
              dashboardRef.current.handleJoy();
            }
            break;
          }
          case 2:
            dashboardRef.current.handleAngry();
            break;
          case 3:
            dashboardRef.current.handleSulk();
            break;
          case 4:
            dashboardRef.current.handleFear();
            break;
          case 5:
            dashboardRef.current.handleQuestion();
            break;
          default:
            console.warn("未定義のコード:", code);
            break;
        }
      }

      // 最後のメッセージでなければ、duration 経過後に次のメッセージへ移行
      if (currentIndex < messages.length - 1) {
        setShowComment(true);
        const timer = setTimeout(() => {
          setShowComment(false);
          setCurrentIndex((prev) => prev + 1);
        }, duration);
        return () => clearTimeout(timer);
      } else {
        // 最後のメッセージの場合は、タイマーで非表示にせずそのまま表示状態を維持
        setShowComment(true);
      }
    }
  }, [currentIndex, messages]);

  // currentText を50ミリ秒ごとに1文字ずつ表示する処理
  useEffect(() => {
    // 新しいテキストが来たら表示をリセット
    setDisplayedMessage("");
    if (!currentText) return;
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedMessage((prev) => prev + currentText.charAt(index));
      index++;
      if (index >= currentText.length) {
        clearInterval(interval);
      }
    }, 50); // 50ミリ秒ごとに1文字追加
    return () => clearInterval(interval);
  }, [currentText]);

  return (
    <div className="flex flex-col items-center">
      {showComment && <Comment>{displayedMessage}</Comment>}
      <Dashboard ref={dashboardRef} />
    </div>
  );
};

export default ChatFlow;
