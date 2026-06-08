import { api } from "../lib/api";

// GET ALL TRAININGS
export const getTrainings = () => {
  return api.get("/training-programs");
};


// GET TRAINING BY ID
export const getTrainingById = (id: any) => {
  return api.get(`/training-programs/${id}`);
};

// CREATE TRAINING (ADMIN)
export const createTraining = (data: any) => {
  return api.post("/training-programs", data);
};

// UPDATE TRAINING (ADMIN)
export const updateTraining = (id: any, data: any) => {
  return api.patch(`/training-programs/${id}`, data);
};

export const deleteTraining = (id: string) => {
  return api.delete(`/training-programs/${id}`);
};

export const toggleTrainingStatus = (id: string, active: boolean) => {
  return api.patch(`/training-programs/${id}`, { active });
};

export const toggleFeaturedTraining = (id: string, featured: boolean) => {
  return api.patch(`/training-programs/${id}`, { featured });
};

export const uploadTrainingMedia = (id: string, data: FormData) => {
  return api.post(`/training-programs/${id}/media`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
