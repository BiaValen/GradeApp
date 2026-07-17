import { redirect } from "next/navigation";

// "/" não é mais uma tela intermediária — a seleção de curso é a porta de entrada.
export default function Home() {
  redirect("/curso");
}
