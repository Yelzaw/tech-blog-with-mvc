const newCommentHandler = async (event) => {
  event.preventDefault();
  if(event.target.hasAttribute('data-id')){
  const comment = document.querySelector('#comment').value.trim();
  const post_id = event.target.getAttribute('data-id');

  
    console.log(comment, post_id)
  

  if (comment && post_id) {
    const response = await fetch(`/api/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment, post_id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace(`/post/${post_id}`);
    } else {
      alert('Failed to create project');
    }
  }
}
};


document
  .querySelector('.new-comment-form')
  .addEventListener('submit', newCommentHandler);

