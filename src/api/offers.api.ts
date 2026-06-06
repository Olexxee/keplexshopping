import { api } from "../lib/api";

export const getPublicOffers = () => {
  return api.get("/public/offers");
};
