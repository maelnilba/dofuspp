import Head from "next/head";

export default function ReactExample() {
  return (
    <>
      <Head>
        <title>Dofus pp - React</title>
      </Head>
      <div className="w-screen min-h-screen bg-black text-white flex flex-col py-10 items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold">Implement with React</h1>
          <h2>Make the API fetch</h2>
          <pre>
            {`
            const res = await fetch("https://dofuspp.nib.gg/api/skin?url=" + url, {
                method: "GET"
            })

            const json = await res.json()
            `}
          </pre>
          <h2>Type the result</h2>
          <pre>
            {`
            type SkinImage = {
                src: string; // url from ankama website (protected)
                image: string; // base64 image
            };
            `}
          </pre>
          <h2>Display in JSX</h2>
          <pre>
            {`
            <img
                alt={image.src}
                src={"data:image/png;base64, " + image.image}
            />
            `}
          </pre>
        </div>
      </div>
    </>
  );
}
