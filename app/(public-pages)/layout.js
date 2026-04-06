import Footer from '@/components/footer';
import Navbar from '@/components/navbar';

export const metadata = {
    title: 'Verix - Project Risk Management & SBOM',
    description: 'Unified Project Risk Management System. Identify Security, Legal, and Operational risks while generating compliance-ready CycloneDX SBOMs.',
    appleWebApp: {
        title: 'Verix Risk Management',
    },
};

export default function Layout({ children }) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
