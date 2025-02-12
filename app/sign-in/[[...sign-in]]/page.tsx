"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6">
      <div className="absolute top-4 left-4">
        {/* Botón para regresar a la raíz */}
        <Link href="/">
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-300">
            Regresar al Inicio
          </button>
        </Link>
      </div>
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#4F46E5", // Color principal (índigo)
            colorBackground: "#1F2937", // Fondo general (gris oscuro)
            colorText: "#F3F4F6", // Texto principal (gris claro)
            colorInputBackground: "#374151", // Fondo de los inputs
            colorInputText: "#FFFFFF", // Texto en los inputs
          },
          elements: {
            card: "rounded-lg shadow-lg p-6 bg-gray-800", // Tarjeta principal
            headerTitle: "text-2xl font-bold text-white", // Título principal
            headerSubtitle: "text-sm text-gray-400", // Subtítulo
            formFieldInput:
              "w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500", // Inputs del formulario
            formButtonPrimary:
              "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300", // Botón principal
            socialButtonsBlockButton:
              "w-full bg-gray-700 hover:bg-gray-600 text-white rounded-md py-2 flex items-center justify-center gap-2", // Botones sociales
            footerActionText: "text-gray-400 text-sm", // Texto del pie
            footerActionLink: "text-indigo-400 hover:text-indigo-300 font-medium", // Enlaces del pie
          },
        }}
      />
    </div>
  );
}
