import Link from "next/link";
import { createUc } from "../actions";
import { UcForm } from "../uc-form";

export default function NovaMateriaPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <Link href="/materias" className="text-sm text-blue-600 underline">
        ← Matérias
      </Link>
      <h1 className="mb-6 text-2xl font-semibold">Nova UC</h1>
      <UcForm action={createUc} />
    </main>
  );
}
