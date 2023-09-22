import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
} from 'axios';
import { EHttpMethod } from '../common/enums';

class ApiService {
  private axios: AxiosInstance;

  constructor(axiosConfig?: AxiosRequestConfig) {
    this.axios = axios.create({
      ...axiosConfig,
      baseURL: `http://localhost:3001/posts`,
    });
  }

  public async patch<TRes, TData>(requestConfig?: AxiosRequestConfig<TData>): Promise<TRes> {
    const resp = await this.axios.request<TRes, AxiosResponse<TRes>, TData>({
      ...requestConfig,
      method: EHttpMethod.PATCH,
    });

    return resp?.data;
  }

  public async post<TRes, TData>(requestConfig?: AxiosRequestConfig<TData>): Promise<TRes> {
    const resp = await this.axios.request<TRes, AxiosResponse<TRes>, TData>({
      ...requestConfig,
      method: EHttpMethod.POST,
    });

    return resp?.data;
  }

  public async get<TRes>(requestConfig?: AxiosRequestConfig): Promise<TRes> {
    const resp = await this.axios.request<TRes, AxiosResponse<TRes>>({
      ...requestConfig,
      method: EHttpMethod.GET,
    });

    return resp?.data;
  }

  public async delete<TRes, TData = {}>(requestConfig?: AxiosRequestConfig): Promise<TRes> {
    const resp = await this.axios.request<TRes, AxiosResponse<TRes>, TData>({
      ...requestConfig,
      method: EHttpMethod.DELETE,
    });

    return resp?.data;
  }
}

export default ApiService;
