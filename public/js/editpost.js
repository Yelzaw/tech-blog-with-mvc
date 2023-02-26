
//Edit and Update existing post
const editFormHandler = async (event) => {
  event.preventDefault();
  if (event.target.hasAttribute('data-note')) {
    const title = document.querySelector('#title').value;
    const post = document.querySelector('#content').value;
  const post_id = event.target.getAttribute('data-note');
console.log(title, post, post_id)
  if (title && post && post_id) {
    const response = await fetch(`/api/posts/${post_id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, post }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response)
    if (response.ok) {
      document.location.replace(`/dashboard`);
    } else {
      alert('Failed to create post');
    }
  }
}
};

//Delete the post 
const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to delete post');
    }
  }
};

document
  .querySelector('.edit-post-form')
  .addEventListener('submit', editFormHandler);

document
  .querySelector('.del-post')
  .addEventListener('click', delButtonHandler);
