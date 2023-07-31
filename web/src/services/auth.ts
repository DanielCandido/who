import api from "./api";
import { Authenticate } from "@/@types";

export const auth = (email: string, password: string) => {
  let data = {
    email,
    password,
  };

  return api.post<Authenticate>("/auth", data);
};
