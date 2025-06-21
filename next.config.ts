import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*",
			},
		],
	},
	devIndicators: {},
};

export default nextConfig;
