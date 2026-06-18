import { auth } from "@/lib/auth";
import { getUsers } from "@/actions/admin";
import { Header } from "@/components/layout/Header";
import { UserRoleForm } from "@/components/admin/UserRoleForm";

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await getUsers();

  return (
    <>
      <Header email={session!.user.email} role={session!.user.role} />
      <main className="app-main">
        <h1 className="app-board-title" style={{ marginBottom: 24 }}>
          USER MANAGEMENT
        </h1>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <UserRoleForm
                    userId={user.id}
                    currentRole={user.role}
                    isSelf={user.id === Number(session!.user.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
