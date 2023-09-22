/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import './App.scss';
import usePosts, { EPostsHookReferer } from './api/usePosts';
import { IAppPost, IDeletePost, IPost } from './common/interfaces';
import { produce } from 'immer';

const App: FC = () => {
  const [apiActions, apiState] = usePosts();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [post, setPost] = useState<IAppPost>( { text: ``, title: `` });

  const handleDeletePost = (id: number) => {
    if (!window.confirm(`Are you sure?`)) {
      return;
    }

    void apiActions.deletePost(id);
  }

  const handleAddPost = () => {
    void apiActions.addPost({ text: post.text, title: post.title });
  }

  const handleSetPost = (name: string, value: string) => {
    setPost(produce(draft => {
      // @ts-ignore
      draft[name] = value;
    }));
  }

  useEffect(() => {
    void apiActions.getPosts();
  }, []);

  useEffect(() => {
    if (!apiState.response) {
      return;
    }

    switch (apiState.referer) {
      case EPostsHookReferer.GET_POSTS:
        setPosts(apiState.response as IPost[]);
        break;
      case EPostsHookReferer.DELETE_POST:
        setPosts(posts.filter(post => post.id !== (apiState.response as IDeletePost).id));
        break;
      case EPostsHookReferer.ADD_POST:
        setPosts([...posts, (apiState.response as IPost)]);
        break;
      default:
    }

  }, [apiState.response]);

  return (
    <div className="App">
      <h2>Posts</h2>

      {apiState.loading
        ? <div>Loading ...</div>
        : posts.map(post => (
          <div className="App__post">
            <div className="App__post-id"><b>ID:</b> {post.id}</div>
            <div className="App__post-title"><b>Title:</b> {post.title}</div>
            <div className="App__post-text"><b>Text:</b> {post.text}</div>
            <input
              className="App__post-delete"
              type="button"
              value="Delete Post"
              onClick={() => handleDeletePost(post.id)}
            />
          </div>
        ))}

      {!apiState.loading && (
        <>
          <h2>Add Post</h2>
          <div className="App__add-post">
            <input
              name="title"
              placeholder="Title"
              type="text"
              onChange={event => handleSetPost(event.target.name, event.target.value)} />
            <input
              name="text"
              placeholder="Text"
              type="text"
              onChange={event => handleSetPost(event.target.name, event.target.value)} />
            <input
              type="button"
              value="Add"
              onClick={handleAddPost} />
          </div>
        </>
      )}
    </div>
  )
}

export default App;
