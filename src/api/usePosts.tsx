import { AxiosError } from 'axios';
import ApiService from './ApiService';
import { useState } from 'react';
import { produce } from 'immer';
import { IResponsePost } from '../common/interfaces';

export enum EPostsHookReferer {
  GET_POSTS,
}

interface IPostsHookState {
  loading: boolean;
  error: AxiosError | null;
  response: IResponsePost | IResponsePost[] | null;
  referer: EPostsHookReferer | null;
}

type TPostsHook = [{
  getPosts: () => Promise<void>,
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
      const response = await apiService.get<IResponsePost[]>();

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


  return [{
    getPosts,
  }, state];
}

export default usePosts;
