import {AgoraApiResponse, AgoraInstanceClient, RequestOptions} from "./agora-instance-client";

export type OfficialSdkClientOptions = {
  sdk: {
    request<T = unknown>(options: RequestOptions): Promise<AgoraApiResponse<T>>;
  };
};

export class OfficialSdkClient implements AgoraInstanceClient {
  private readonly sdk: OfficialSdkClientOptions["sdk"];

  public constructor(options: OfficialSdkClientOptions) {
    this.sdk = options.sdk;
  }

  public request<T = unknown>(options: RequestOptions): Promise<AgoraApiResponse<T>> {
    return this.sdk.request<T>(options);
  }
}