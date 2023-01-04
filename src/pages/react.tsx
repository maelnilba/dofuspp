import Head from "next/head";
import hljs from "highlight.js";
import { useEffect, useState } from "react";
import { fetchAPI, jsxCode, typeAPI } from "../utils/reactExample";

export default function ReactExample() {
  useEffect(() => {
    hljs.highlightAll();
  });
  return (
    <>
      <Head>
        <title>Dofus pp - React</title>
      </Head>
      <div className="w-screen min-h-screen bg-black text-white flex flex-col py-10 items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold">Implement with React</h1>
          <h2>Make the API fetch</h2>
          <Code code={fetchAPI} language="typescript" />
          <h2>Type the result</h2>
          <Code code={typeAPI} language="typescript" />
          <h2>Display in JSX</h2>
          <Code code={jsxCode} language="html" />
        </div>
      </div>
    </>
  );
}

type CodeProps = {
  code: string;
  language: "typescript" | "html";
};
const Code = (props: CodeProps) => {
  const [effect, setEffect] = useState(false);
  const copy = async (code: string) => {
    setEffect(true);
    await navigator.clipboard.writeText(code);
  };

  return (
    <pre className="rounded text-sm relative">
      <code className={"language-" + props.language}>{props.code}</code>
      <button
        onClick={() => copy(props.code)}
        className={`${
          effect && "animate-wiggle"
        } text-xs text-white transition-opacity bg-black border-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-500 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 absolute bottom-0 right-0`}
        onAnimationEnd={() => setEffect(false)}
      >
        copy
      </button>
    </pre>
  );
};
