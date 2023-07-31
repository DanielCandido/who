import { AxiosHeaders } from "axios";
import api from "../api";
import { SyncSocketResponse } from "./types";

export const syncSocket = (userId: string, clientId: string, token: string) => {
  const headers = new AxiosHeaders();

  headers.setAuthorization(`Bearer ${token}`);

  return api.put<SyncSocketResponse>(
    "/user/syncSocket",
    {
      userId,
      clientId,
    },
    { headers }
  );
};
