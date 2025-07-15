"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { hasRouteAccess } from "@/lib/roleAccess";

export default function HomePage() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user role
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.role);
        } else {
          setUserRole("VISITOR"); // Default to visitor if not authenticated
        }
      } catch (err) {
        setUserRole("VISITOR"); // Default to visitor on error
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Function to get appropriate link based on user role
  const getFeatureLink = (originalLink) => {
    // Allow direct access to join-society and public pages
    if (originalLink === "/join-society" || originalLink === "/Features") {
      return originalLink;
    }

    // For unauthorized users, redirect to feature showcase
    if (
      !userRole ||
      userRole === "VISITOR" ||
      !hasRouteAccess(userRole, originalLink)
    ) {
      return "/feature-showcase";
    }
    return originalLink;
  };
  // Show loading state to prevent flash of wrong content
  if (loading) {
    return (
      <main className="px-6 md:px-12 py-10 space-y-20 bg-gray-50 scroll-smooth">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-blue-600 text-lg">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 md:px-12 py-10 space-y-20 bg-gray-50 scroll-smooth">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 relative">
        {/* Image with text overlay */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative w-full md:w-1/2 h-96"
        >
          <Image
            src="https://res.cloudinary.com/dayrre5om/image/upload/v1748156504/b4ee1d95-a7c1-42e9-9386-cd583f2b1813.png"
            alt="Society"
            fill
            className="object-cover rounded-lg shadow-lg"
            priority
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-6 rounded-lg">
            <h1 className="text-white text-3xl md:text-4xl font-bold text-center leading-snug">
              Giant leap towards a <span className="text-red-500">SMART</span>{" "}
              society.
            </h1>
          </div>
        </motion.div>

        {/* Description and CTA */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center md:text-left space-y-6 md:w-1/2"
        >
          <p className="text-lg text-gray-700">
            Our all-in-one solution empowers societies to streamline their
            management, making it effortless and efficient. From simplified
            accounting and billing to enhanced communication and transparency,
            we offer the tools you need to create harmonious living
            environments.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="https://www.youtube.com"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full hover:bg-blue-300 transition"
            >
              Watch Intro
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.1 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-center text-3xl font-semibold text-blue-800 mb-10">
          Experience community management at its best
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              title: "End-to-End Accounting",
              img: "https://res.cloudinary.com/dayrre5om/image/upload/v1748016715/WhatsApp_Image_2025-05-23_at_21.40.22_368915a7_uhkm97.jpg",
              desc: "From billing to expenses, year-end transactions, audit statements, you get complete control.",
              link: "/Accounting",
            },
            {
              title: "Visitor Management",
              img: "https://res.cloudinary.com/dayrre5om/image/upload/v1748017704/WhatsApp_Image_2025-05-23_at_21.45.24_159de20f_uei3wx.jpg",
              desc: "Secure your premises by verifying every visitor directly with residents seamlessly.",
              link: "/dashboard/visitor/new",
            },
            {
              title: "Complaint Management",
              img: "https://res.cloudinary.com/dayrre5om/image/upload/v1748092865/42352cec-7291-4c5b-a420-e16d62eca3b3.png",
              desc: "Log and resolve resident complaints quickly and efficiently with full transparency.",
              link: "/complaints",
            },
            {
              title: "Facility Booking",
              img: "https://res.cloudinary.com/dayrre5om/image/upload/v1748093061/44d10ad6-5123-4ab5-a31e-b39ab914ebdf.png",
              desc: "Let residents book community facilities online with real-time availability.",
              link: "/Facilities",
            },
            {
              title: "Emergency Contacts",
              img: "https://res.cloudinary.com/dayrre5om/image/upload/v1748017717/WhatsApp_Image_2025-05-23_at_21.52.25_2e8d5959_mua127.jpg",
              desc: "Quickly access emergency contacts for police, fire, and medical services with just a tap.",
              link: "/emergency-contacts",
            },
            {
              title: "Document Repository",
              img: "/image.png",
              desc: "Store, access and manage all important society documents in a secure, organized digital repository anytime.",
              link: "/document-repository",
            },
            {
              title: "Staff Management",
              img: "/image copy.png",
              desc: "Maintain staff details, shift schedules, and assign responsibilities with complete visibility.",
              link: "/staff",
            },
          ].map((feature, index) => {
            const linkHref = getFeatureLink(feature.link);
            const isRedirectToShowcase =
              linkHref === "/feature-showcase" &&
              feature.link !== "/feature-showcase";
            const isRedirectToJoin =
              linkHref === "/join-society" && feature.link !== "/join-society";

            return (
              <Link
                href={linkHref}
                key={index}
                className="block relative group"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 hover:border-blue-300"
                >
                  <div className="w-full h-40 relative mb-4">
                    <Image
                      src={feature.img}
                      alt={feature.title}
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                  <h3 className="font-bold text-lg text-center text-blue-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-center text-gray-600">
                    {feature.desc}
                  </p>
                  {(isRedirectToShowcase || isRedirectToJoin) && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {isRedirectToShowcase
                        ? "Preview Feature"
                        : "Join to Access"}
                    </div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.section>

      {/* Call-to-Action Section */}
      <motion.section
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="text-center max-w-4xl mx-auto space-y-6"
      >
        <h2 className="text-3xl font-bold text-blue-900">
          Go live in less than 48 hours!
        </h2>
        <p className="text-lg text-gray-700">
          Experience the first support-free application post onboarding. Our
          simplified user interface helps you get started in just a matter of
          hours.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/join-society"
            className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
          >
            Join a Society
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
