import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// 🔥 Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyCYBpTxF3QmiYjzB9xYiSDwdBk0vOkl-nM",
  authDomain: "insmk-eb4a3.firebaseapp.com",
  projectId: "insmk-eb4a3",
  storageBucket: "insmk-eb4a3.firebasestorage.app",
  messagingSenderId: "90162642372",
  appId: "1:90162642372:web:8d7505199e65aa1fe63891",
  measurementId: "G-4HY7N4V64H"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 나이대 기준 (원하면 여기 숫자만 바꾸면 됨)
const SILVER_START = 1955;
const SILVER_END = 1964;
const NORMAL_START = 1966;
const NORMAL_END = 1996;

const dateInput = document.getElementById("dateInput");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const birthInput = document.getElementById("birth");
const typeInput = document.getElementById("type");

dateInput.value = localStorage.getItem("lastDate") || "";

// 날짜 기억
dateInput.addEventListener("change", () => {
  localStorage.setItem("lastDate", dateInput.value);
});

// 나이대 자동 분류
birthInput.addEventListener("change", () => {
  const year = new Date(birthInput.value).getFullYear();
  if (year >= SILVER_START && year <= SILVER_END) typeInput.value = "실버";
  else if (year >= NORMAL_START && year <= NORMAL_END) typeInput.value = "일반";
  else typeInput.value = "기타";
});

// 저장
document.getElementById("saveBtn").addEventListener("click", async () => {
  const name = nameInput.value;
  const phone = phoneInput.value;

  if (!/^[가-힣]{2,5}$/.test(name)) return alert("이름은 한글 2~5글자만 가능");
  if (!/^010-\d{4}-\d{4}$/.test(phone)) return alert("연락처 형식 오류");

  await addDoc(collection(db, "consults"), {
    date: dateInput.value,
    counselor: document.getElementById("counselor").value,
    name,
    phone,
    birth: birthInput.value,
    gender: document.getElementById("gender").value,
    area1: document.getElementById("area1").value,
    area2: document.getElementById("area2").value,
    area3: document.getElementById("area3").value,
    memo: document.getElementById("memo").value,
    content: document.getElementById("content").value,
    type: typeInput.value,
    createdAt: new Date()
  });

  alert("저장 완료!");
});

// 엑셀 다운로드
document.getElementById("downloadExcel").addEventListener("click", async () => {
  const snapshot = await getDocs(collection(db, "consults"));
  let csv = "날짜,상담사,이름,연락처,실버/일반\n";

  snapshot.forEach(doc => {
    const d = doc.data();
    csv += `${d.date},${d.counselor},${d.name},${d.phone},${d.type}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "insmk.csv";
  a.click();
});
