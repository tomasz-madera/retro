"use client";

import { useRouter } from "next/navigation";
import { updateUserRole } from "@/actions/admin";
import { ThemedButton } from "@/components/theme/ThemedButton";

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
    return <span className="app-text-muted">—</span>;
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {currentRole !== "admin" && (
        <ThemedButton
          className="app-button-sm"
          onClick={() => handleRoleChange("admin")}
        >
          Make Admin
        </ThemedButton>
      )}
      {currentRole !== "user" && (
        <ThemedButton
          className="app-button-sm"
          variant="secondary"
          onClick={() => handleRoleChange("user")}
        >
          Make User
        </ThemedButton>
      )}
    </div>
  );
}
