import { supabase } from "./supabaseClient";

export async function logAdmin(
  action: string,
  entity: string,
  entity_id?: string
) {
  await supabase.from("admin_logs").insert({
    action,
    entity,
    entity_id,
  });
}
