import axios from "axios";
import { getAuthHeaders } from "./apiAuth";
import { API_V1, mediaUrl } from "./apiBase";
import type { Plan } from "../types/models";

export function getMultipartAuthHeaders() {
  return getAuthHeaders();
}

export async function fetchAllPlans(): Promise<Plan[]> {
  const res = await axios.get(`${API_V1}/plan/`, { params: { diet: "veg" } });
  return res.data.Allplans || [];
}

export async function createPlanWithImages(
  formFields: Record<string, string | number | undefined | null>,
  imageFiles?: File[]
) {
  const fd = new FormData();
  Object.entries(formFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      fd.append(key, String(value));
    }
  });
  (imageFiles || []).forEach((file) => fd.append("images", file));

  return axios.post(`${API_V1}/plan/with-images`, fd, {
    headers: getMultipartAuthHeaders(),
  });
}

export async function updatePlanMedia(planId: string, imageFiles?: File[]) {
  const fd = new FormData();
  (imageFiles || []).forEach((file) => fd.append("images", file));

  return axios.put(`${API_V1}/plan/${planId}/media`, fd, {
    headers: getMultipartAuthHeaders(),
  });
}

export async function updatePlan(planId: string, fields: Record<string, unknown>) {
  return axios.patch(`${API_V1}/plan/${planId}`, fields, {
    headers: getAuthHeaders(),
  });
}

export async function deletePlan(planId: string) {
  return axios.delete(`${API_V1}/plan/${planId}`, {
    headers: getAuthHeaders(),
  });
}

export async function reindexRag() {
  return axios.post(
    `${API_V1}/suggest/reindex`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
}

export function planImageUrl(path?: string | null): string {
  return mediaUrl(path);
}
