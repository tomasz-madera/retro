import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { NewRetroForm } from "@/components/board/NewRetroForm";

export default async function NewRetroPage() {
  const session = await auth();

  return (
    <>
      <Header email={session!.user.email} role={session!.user.role} />
      <main className="app-main">
        <h1 className="app-board-title" style={{ marginBottom: 24 }}>
          NEW RETROSPECTIVE
        </h1>
        <NewRetroForm />
      </main>
    </>
  );
}
