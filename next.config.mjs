/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/menu/Jadwal%20Dokter/profiledokter',
        destination: '/menu/jadwal-dokter/profiledokter',
        permanent: false,
      },
      {
        source: '/menu/Jadwal Dokter/profiledokter',
        destination: '/menu/jadwal-dokter/profiledokter',
        permanent: false,
      },
    ];
  },
};
export default nextConfig;
