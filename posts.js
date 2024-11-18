const db = firebase.firestore();
const auth = firebase.auth();

document.getElementById("postForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector('input[name="title"]').value;
  const content = document.querySelector('textarea[name="content"]').value;

  db.collection("posts").add({
    title,
    content,
    date: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("Пост добавлен!");
    loadPosts();
  }).catch((error) => {
    console.error("Ошибка:", error);
  });
});

function loadPosts() {
  db.collection("posts").orderBy("date", "desc").get().then((querySnapshot) => {
    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = "";
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
  });
}

loadPosts(); // Загрузить посты при загрузке страницы
