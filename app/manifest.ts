import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mahan Ghafarian Studio | Photography & Videography",
    short_name: "MG Studio",
    description:
      "The visual work of Mahan Ghafarian — photography and videography portfolio.",
    start_url: "/",
    display: "standalone",
    background_color: "#080807",
    theme_color: "#080807",
    icons: [
      {
        src: "/Mahan_Ghafarian_Logo.png",
        sizes: "1080x1080",
        type: "image/png",
      },
    ],
  };
}
