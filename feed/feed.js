import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCgLQarOfqIlg5oogTxF8RGO3qS3nqenLQ",
  authDomain: "k-dev-xyz.firebaseapp.com",
  projectId: "k-dev-xyz",
  storageBucket: "k-dev-xyz.appspot.com",
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
      closeLoginModal();
    })
    .catch((error) => {
      alert("Ошибка входа: " + error.message);
    });
}

window.login = login;

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.querySelector(".nav-button[onclick='openPostModal()']").style.display = "inline";
  } else {
    document.querySelector(".nav-button[onclick='openPostModal()']").style.display = "none";
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
    closePostModal();
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

      // Полный контент сохраняется в атрибуте data для toggleReadMore
      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p class="post-content" data-full-content="${post.content}">${post.content.substring(0, 200)}... 
          <button onclick="toggleReadMore(this)">Читать далее</button>
        </p>
        <small>${post.date ? new Date(post.date.seconds * 1000).toLocaleString() : "Дата неизвестна"}</small>
        <div class="comments">
          <h4>Комментарии</h4>
          <div class="comment-list"></div>
          <input type="text" placeholder="Ваш никнейм" id="nickname-${doc.id}">
          <textarea placeholder="Текст комментария" id="commentText-${doc.id}"></textarea>
          <button onclick="addComment('${doc.id}')">Отправить</button>
        </div>
      `;
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Ошибка при загрузке постов:", error);
  }
}

window.loadPosts = loadPosts;

function toggleReadMore(button) {
  const postContent = button.parentElement;
  if (button.innerText === "Читать далее") {
    postContent.innerHTML = `${postContent.dataset.fullContent} <button onclick="toggleReadMore(this)">Свернуть</button>`;
  } else {
    postContent.innerHTML = `${postContent.dataset.fullContent.substring(0, 200)}... <button onclick="toggleReadMore(this)">Читать далее</button>`;
  }
}

async function addComment(postId) {
  const nickname = document.getElementById(`nickname-${postId}`).value;
  const commentText = document.getElementById(`commentText-${postId}`).value;

  if (!nickname || !commentText) {
    alert("Пожалуйста, заполните все поля комментария.");
    return;
  }

  try {
    await addDoc(collection(db, `posts/${postId}/comments`), {
      nickname,
      commentText,
      date: serverTimestamp()
    });
    alert("Комментарий добавлен!");
    loadPosts(); // Перезагрузка всех постов для отображения нового комментария
  } catch (error) {
    console.error("Ошибка при добавлении комментария:", error);
  }
}

window.toggleReadMore = toggleReadMore;
window.addComment = addComment;

function openLoginModal() {
  document.getElementById("loginModal").classList.remove("hidden");
}

function closeLoginModal() {
  document.getElementById("loginModal").classList.add("hidden");
}

function openPostModal() {
  document.getElementById("postModal").classList.remove("hidden");
}

function closePostModal() {
  document.getElementById("postModal").classList.add("hidden");
}

window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.openPostModal = openPostModal;
window.closePostModal = closePostModal;

loadPosts();
