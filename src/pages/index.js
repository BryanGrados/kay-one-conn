import useSWR, { SWRConfig } from "swr";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
	const [orderNumber, setOrderNumber] = useState("");
	const { data, error, isValidating } = useSWR(
		orderNumber ? `/api/orden/getDetail/${orderNumber}` : null,
		fetcher,
	);
	const inputRef = useRef(null);

	const handleFormSubmit = (event) => {
		event.preventDefault();
		setOrderNumber(inputRef.current.value);
	};

	return (
		<div className="bg-[#f8f8fb] dark:bg-zinc-900 h-screen w-full">
			<div className="flex justify-between items-center bg-white px-4 py-2 sm:px-6 md:px-8 lg:px-10 border border-b-gray-200 shadow-lg">
				<Image
					src="/logo.jpg"
					alt="Kayser One Connect"
					width={50}
					height={10}
					className="object-contain rounded-lg shadow-md"
				/>
				<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold  text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-slate-600 to-zinc-800">
					Kayser One Connect
				</h1>
				<div className="flex">
					<button className="bg-[#0084CA] hover:bg-blue-700 text-md text-white font-bold py-2 px-2 rounded-md shadow-lg">
						Login
					</button>
				</div>
			</div>
		</div>
	);
}
