document.addEventListener("DOMContentLoaded", function () {
  const postForm = document.getElementById("postForm");
  
  if (postForm) {
    postForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.querySelector('input[name="title"]').value;
      const content = document.querySelector('textarea[name="content"]').value;

      try {
        await db.collection("posts").add({
          title,
          content,
          date: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("Пост добавлен!");
        loadPosts();
      } catch (error) {
        console.error("Ошибка:", error);
      }
    });
  }

  async function loadPosts() {
    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = "";

    try {
      const postsQuery = db.collection("posts").orderBy("date", "desc");
      const querySnapshot = await postsQuery.get();

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

  loadPosts();
});
