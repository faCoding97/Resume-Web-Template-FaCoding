"use client";

import { motion } from "framer-motion";

export default function Section({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <motion.h2
        className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-100 mb-3"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
      >
        {title}
      </motion.h2>
      {children}
    </section>
  );
}