import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { CRTScreen } from "@/components/retro/CRTScreen";
import { NewRetroForm } from "@/components/board/NewRetroForm";

export default async function NewRetroPage() {
  const session = await auth();

  return (
    <CRTScreen>
      <Header email={session!.user.email} role={session!.user.role} />
      <main className="retro-main">
        <h1 className="retro-board-title" style={{ marginBottom: 24 }}>
          NEW RETROSPECTIVE
        </h1>
        <NewRetroForm />
      </main>
    </CRTScreen>
  );
}
