// Firebase SDK (script 태그 방식, 모듈)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// 🔥 네 Firebase 설정 (그대로 사용)
const firebaseConfig = {
  apiKey: "AIzaSyCYBpTxF3QmiYjzB9xYiSDwdBk0vOkl-nM",
  authDomain: "insmk-eb4a3.firebaseapp.com",
  projectId: "insmk-eb4a3",
  storageBucket: "insmk-eb4a3.firebasestorage.app",
  messagingSenderId: "90162642372",
  appId: "1:90162642372:web:8d7505199e65aa1fe63891",
  measurementId: "G-4HY7N4V64H"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 버튼 클릭 → Firestore 저장
document.getElementById("saveBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone) {
    alert("이름과 연락처를 입력해줘");
    return;
  }

  try {
    await addDoc(collection(db, "consults"), {
      name,
      phone,
      createdAt: new Date()
    });
    alert("🔥 DB 저장 성공!");
  } catch (e) {
    console.error(e);
    alert("❌ 저장 실패 (F12 콘솔 확인)");
  }
});
