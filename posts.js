// posts.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Инициализация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCgLQarOfqIlg5oogTxF8RGO3qS3nqenLQ",
  authDomain: "k-dev-xyz.firebaseapp.com",
  projectId: "k-dev-xyz",
  storageBucket: "k-dev-xyz.firebasestorage.app",
  messagingSenderId: "743827941561",
  appId: "1:743827941561:web:317e24d0d288f1ece4d368"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Функция для добавления поста
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.querySelector('input[name="title"]').value;
  const content = document.querySelector('textarea[name="content"]').value;

  try {
    await addDoc(collection(db, "posts"), {
      title,
      content,
      date: serverTimestamp()
    });
    alert("Пост добавлен!");
    loadPosts();
  } catch (error) {
    console.error("Ошибка:", error);
  }
});

// Функция для загрузки постов
async function loadPosts() {
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = "";

  try {
    const postsQuery = query(collection(db, "posts"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(postsQuery);
    
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <small>${post.date ? new Date(post.date.seconds * 1000).toLocaleString() : "Дата неизвестна"}</small>
      `;
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Ошибка при загрузке постов:", error);
  }
}

// Загрузка постов при загрузке страницы
loadPosts();
