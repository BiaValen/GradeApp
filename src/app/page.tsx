import { redirect } from "next/navigation";

// "/" não é mais uma tela intermediária — o Plano é a home do app.
export default function Home() {
  redirect("/plano");
}
