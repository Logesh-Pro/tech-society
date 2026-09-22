import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;

let basePath = "";
if (isGithubActions) {
  basePath = "/tech-society";
}

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
