"use client";

import { useRouter } from "next/navigation";
import { updateUserRole } from "@/actions/admin";
import { RetroButton } from "@/components/retro/RetroButton";

type UserRoleFormProps = {
  userId: number;
  currentRole: "user" | "admin";
  isSelf: boolean;
};

export function UserRoleForm({
  userId,
  currentRole,
  isSelf,
}: UserRoleFormProps) {
  const router = useRouter();

  async function handleRoleChange(role: "user" | "admin") {
    if (role === currentRole) return;

    const result = await updateUserRole(userId, role);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  if (isSelf) {
    return <span className="retro-text-dim">—</span>;
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {currentRole !== "admin" && (
        <RetroButton
          className="retro-btn-sm"
          onClick={() => handleRoleChange("admin")}
        >
          Make Admin
        </RetroButton>
      )}
      {currentRole !== "user" && (
        <RetroButton
          className="retro-btn-sm"
          variant="secondary"
          onClick={() => handleRoleChange("user")}
        >
          Make User
        </RetroButton>
      )}
    </div>
  );
}
