/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',      // <-- enables static export
    images: {
        unoptimized: true, // keep your current image config
    },
};

export default nextConfig;