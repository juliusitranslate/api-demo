import { AxiosError } from 'axios';
import ApiService from './ApiService';
import { useState } from 'react';
import { produce } from 'immer';
import { IAppPost, IDataAddPost, IDeletePost, IPost } from '../common/interfaces';

export enum EPostsHookReferer {
  ADD_POST,
  GET_POSTS,
  DELETE_POST,
}

interface IPostsHookState {
  loading: boolean;
  error: AxiosError | null;
  response: IPost | IPost[] | IDeletePost | null;
  referer: EPostsHookReferer | null;
}

type TPostsHook = [{
  addPost: (data: IDataAddPost) => Promise<void>,
  getPosts: () => Promise<void>,
  deletePost: (id: number) => Promise<void>,
}, IPostsHookState];

function usePosts(): TPostsHook {
  const apiService = new ApiService();
  const [state, setState] = useState<IPostsHookState>({
    error: null,
    loading: true,
    response: [],
    referer: null,
  });

  const resetState = () => {
    setState(produce(draft => {
      draft.error = null;
      draft.loading = true;
      draft.referer = null;
    }));
  };

  const setErrorState = (error: AxiosError, referer: EPostsHookReferer) => {
    setState(produce(draft => {
      draft.error = error;
      draft.loading = false;
      draft.referer = referer;
      draft.response = null;
    }));
  };

  const getPosts = async (): Promise<void> => {
    resetState();

    const referer = EPostsHookReferer.GET_POSTS;

    try {
      const response = await apiService.get<IPost[]>();

      setState(produce(draft => {
        draft.error = null;
        draft.loading = false;
        draft.response = response;
        draft.referer = referer;
      }));
    } catch (error) {
      setErrorState(error as AxiosError, referer);
    }
  };

  const addPost = async (data: IAppPost): Promise<void> => {
    resetState();

    const referer = EPostsHookReferer.ADD_POST;

    try {
      const response = await apiService.post<IPost, IDataAddPost>({ data });

      setState(produce(draft => {
        draft.error = null;
        draft.loading = false;
        draft.response = response;
        draft.referer = referer;
      }));
    } catch (error) {
      setErrorState(error as AxiosError, referer);
    }
  }

  const deletePost = async (id: number): Promise<void> => {
    resetState();

    const referer = EPostsHookReferer.DELETE_POST;

    try {
      await apiService.delete({
        url: `/${id}`,
      });

      setState(produce(draft => {
        draft.error = null;
        draft.loading = false;
        draft.response = { id };
        draft.referer = referer;
      }));
    } catch (error) {
      setErrorState(error as AxiosError, referer);
    }
  }


  return [{
    addPost,
    getPosts,
    deletePost,
  }, state];
}

export default usePosts;
