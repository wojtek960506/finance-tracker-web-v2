import { api } from "@shared/api"

import { type INamedResource, type NamedResourceKind } from "./types"

export const createNamedResource = async (kind: NamedResourceKind, name: string) => {
   const res = await api.post<INamedResource>(`/${kind}`, { name });
   return res.data;
}
