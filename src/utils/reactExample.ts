export const fetchAPI = `
const res = await fetch("https://dofuspp.nib.gg/api/skin?url=" + url, {
    method: "GET"
})

const json = await res.json()
`;

export const typeAPI = `
interface SkinImage {
    src: string; // url from ankama website (protected)
    image: string; // base64 image
};
`;

export const jsxCode = `
<img
    alt={image.src}
    src={"data:image/png;base64, " + image.image}
/>
`;
