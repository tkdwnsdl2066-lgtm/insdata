import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

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

// 나이대 기준
const SILVER_START = 1955;
const SILVER_END = 1964;
const NORMAL_START = 1966;
const NORMAL_END = 1996;

const dateInput = document.getElementById("dateInput");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const birthRawInput = document.getElementById("birthRaw");
const typeInput = document.getElementById("type");

dateInput.value = localStorage.getItem("lastDate") || "";

// 날짜 기억
dateInput.addEventListener("change", () => {
  localStorage.setItem("lastDate", dateInput.value);
});

// 생년월일 입력 → 자동 변환 + 실버/일반 분류
birthRawInput.addEventListener("input", () => {
  const raw = birthRawInput.value.replace(/\D/g, "");

  if (raw.length === 8) {
    const y = raw.slice(0, 4);
    const m = raw.slice(4, 6);
    const d = raw.slice(6, 8);

    const year = parseInt(y, 10);

    if (year >= SILVER_START && year <= SILVER_END) typeInput.value = "실버";
    else if (year >= NORMAL_START && year <= NORMAL_END) typeInput.value = "일반";
    else typeInput.value = "기타";
  }
});

// 저장
document.getElementById("saveBtn").addEventListener("click", async () => {
  const name = nameInput.value;
  const phone = phoneInput.value;
  const raw = birthRawInput.value;

  if (!/^[가-힣]{2,5}$/.test(name)) return alert("이름은 한글 2~5글자만 가능");
  if (!/^010-\d{4}-\d{4}$/.test(phone)) return alert("연락처 형식 오류");
  if (!/^\d{8}$/.test(raw)) return alert("생년월일은 8자리(YYYYMMDD)로 입력");

  const birth = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;

  await addDoc(collection(db, "consults"), {
    date: dateInput.value,
    counselor: document.getElementById("counselor").value,
    name,
    phone,
    birth,
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

  // 🔄 날짜 빼고 전부 초기화
  document.getElementById("counselor").value = "";
  nameInput.value = "";
  phoneInput.value = "";
  birthRawInput.value = "";
  document.getElementById("gender").value = "";
  document.getElementById("area1").value = "";
  document.getElementById("area2").value = "";
  document.getElementById("area3").value = "";
  document.getElementById("memo").value = "";
  document.getElementById("content").value = "";
  typeInput.value = "";
});
