module.exports = {
    webpack(config, { isServer }) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ["@svgr/webpack"],
        });
        const prefix = config.assetPrefix ?? config.basePath ?? "";
        config.module.rules.push({
            test: /\.mp4$/,
            use: [
                {
                    loader: "file-loader",
                    options: {
                        publicPath: `${prefix}/_next/static/media/`,
                        outputPath: `${isServer ? "../" : ""}static/media/`,
                        name: "[name].[hash].[ext]",
                    },
                },
            ],
        });
        return config;
    },
	experimental: {
		appDir: true,
	}
};
