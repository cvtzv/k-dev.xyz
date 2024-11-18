import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "k-dev-xyz.firebaseapp.com",
  projectId: "k-dev-xyz",
  storageBucket: "k-dev-xyz.firebaseapp.com",
  messagingSenderId: "743827941561",
  appId: "1:743827941561:web:317e24d0d288f1ece4d368"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Вы успешно вошли!");
    })
    .catch((error) => {
      alert("Ошибка входа: " + error.message);
    });
}

window.login = login;

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("postSection").style.display = "block";
    document.getElementById("loginSection").style.display = "none";
  } else {
    document.getElementById("postSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
  }
});

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
        <p>${marked.parse(post.content)}</p>
        <small>${post.date ? new Date(post.date.seconds * 1000).toLocaleString() : "Дата неизвестна"}</small>
      `;
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Ошибка при загрузке постов:", error);
  }
}

window.loadPosts = loadPosts;

loadPosts();
