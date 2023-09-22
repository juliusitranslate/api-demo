// API Responses
export interface IPost {
  id: number;
  title: string;
  text: string;
}

export interface IDeletePost {
  id: number;
}

// API Data
export interface IDataAddPost {
  title: string;
  text: string;
}

// State Data
export interface IAppPost {
  title: string;
  text: string;
}