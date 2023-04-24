import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return <main className="h-screen bg-zinc-900 text-white">Hola</main>;
}
