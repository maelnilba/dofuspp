import { Inter } from "@next/font/google";
import Head from "next/head";
import { FormEvent, useEffect, useState } from "react";
import { getLocation } from "../utils/getLocation";
import Image from "next/image";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

type SkinImage = {
  src: string;
  image: string;
};

export default function Home() {
  const [location, setLocation] = useState<string | undefined>();
  useEffect(() => {
    setLocation(getLocation());
  }, []);

  const [image, setImage] = useState<SkinImage | undefined>();
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = (e.currentTarget.elements.namedItem("url") as HTMLInputElement)
      ?.value;

    if (!url) {
      return;
    }

    try {
      setLoading(true);
      const res = (await (
        await fetch("/api/skin?url=" + url, {
          method: "GET",
        })
      ).json()) as SkinImage;
      setImage(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Dofus pp</title>
      </Head>
      <div className="w-screen min-h-screen bg-black text-white flex flex-col py-10 items-center">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl font-extrabold">How to use</h1>
            <h2>
              Call the api/skin endpoint, give your url you want to get as
              params, example :
            </h2>
            <code>
              {location}
              api/skin?url=https://www.dofus.com/fr/mmorpg/communaute/annuaires/pages-persos/215427800294-fapeuh
            </code>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold">Try it out</h2>
            {!loading ? (
              <form
                className="flex gap-2 p-4 justify-center items-center h-28"
                onSubmit={submit}
              >
                <input
                  type="text"
                  name="url"
                  className="bg-black border border-gray-800 text-white text-sm rounded-lg focus:outline-none focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                  placeholder="Page perso"
                />
                <button
                  type="submit"
                  className="text-white bg-black border-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                >
                  Get
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center w-28 h-28 border border-gray-800 rounded-lg bg-black">
                <div className="px-3 py-1 text-xs font-medium leading-none text-center text-white bg-gray-800 rounded-full animate-pulse">
                  loading...
                </div>
              </div>
            )}
            {image && (
              <img
                alt={image.src}
                src={"data:image/png;base64, " + image.image}
              />
            )}
          </div>
        </div>

        <footer className="mb-4 flex gap-4">
          <div className="flex justify-center space-x-2 items-center mb-2 text-lg font-bold hover:cursor-pointer hover:underline ">
            <Image
              className="invert"
              src="/images/logos/GitHub.png"
              width="24"
              height="24"
              alt="Github Logo"
            />
            <a
              target="_blank"
              rel="noreferrer"
              href={"https://github.com/maelnilba/dofuspp"}
            >
              Github
            </a>
          </div>
          -
          <Link
            className="font-bold hover:underline cursor-pointer hover:opacity-80"
            href="/react"
          >
            Implement with React
          </Link>
        </footer>
      </div>
    </>
  );
}
