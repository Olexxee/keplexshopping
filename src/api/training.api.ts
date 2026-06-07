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

// DELETE TRAINING (ADMIN)
export const deleteTraining = (id: any) => {
  return api.delete(`/training-programs/${id}`);
};
