import React from "react";
import { useQuery, useMutation } from "react-query";
async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // replace with useQuery
  // const queryKey= `post-${post && post.id}-comment`
  const queryKey = ["comments", post.id];
  const { data, isLoading, isError, error } = useQuery(
    queryKey,
    () => fetchComments(post && post.id),
    {
      staleTime: 5000,
    }
  );

  const deleteMutation = useMutation((postId) => deletePost(postId));

  const updateMutation = useMutation((postId) => updatePost(postId));

  if (isLoading) {
    return <h3>Loadind comments...</h3>;
  }
  if (isError) {
    return (
      <div>
        <h3>Oops, unable to load the comments</h3>
        <p>{error.toString()}</p>
      </div>
    );
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isError && (
        <p style={{ color: "red" }}>Error deleting the post</p>
      )}
      {deleteMutation.isLoading && (
        <p style={{ color: "purple" }}>deleting the post...</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: "green" }}>post deleted temp...</p>
      )}
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {updateMutation.isError && (
        <p style={{ color: "red" }}>Error updating the post</p>
      )}
      {updateMutation.isLoading && (
        <p style={{ color: "purple" }}>updating the post...</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{ color: "green" }}>post updated temp...</p>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
