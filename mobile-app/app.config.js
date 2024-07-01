import "dotenv/config";

export default {
  expo: {
    name: "mobile-app",
    slug: "mobile-app",
    scheme: "acme",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon-cinephoria.png",

    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon-cinephoria.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      favicon: "./assets/icon-cinephoria.png",
    },
    plugins: ["expo-router"],
    extra: {
      BASE_URL: process.env.BASE_URL,
    },
  },
};
