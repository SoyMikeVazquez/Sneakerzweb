"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

import Sneaker3DScene from "./Sneaker3DScene";

// API endpoint para correos

const steps = [
  { id: 1, title: "Tus Datos", subtitle: "Queremos conocerte" },
  { id: 2, title: "Servicio", subtitle: "¿Qué necesitas?" },
  { id: 3, title: "Recolección", subtitle: "¿Dónde pasamos?" },
];

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    address: "",
    notes: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < steps.length) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar la solicitud');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting booking:', err);
      setError("Hubo un error al procesar tu solicitud. Por favor intenta de nuevo o contáctanos por WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 text-center max-w-lg mx-auto"
      >
        <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-glow">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-bebas text-4xl mb-4 text-white">¡SOLICITUD RECIBIDA!</h2>
        <p className="text-gray-400 mb-8">
          Gracias {formData.name.split(" ")[0]}. Un especialista de Sneakerz se pondrá en contacto contigo en breve para confirmar la recolección.
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="btn-hero-primary"
        >
          VOLVER AL INICIO
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Sidebar: 3D Shoe + Steps */}
      <div className="lg:col-span-5 sticky top-24">
        <div className="h-[400px] relative mb-8">
          <Sneaker3DScene scrollProgress={currentStep / steps.length} />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-500 ${
                  currentStep >= step.id
                    ? "border-orange-600 bg-orange-600 text-white"
                    : "border-gray-700 text-gray-500"
                }`}
              >
                {step.id}
              </div>
              <div>
                <h3 className={`font-bebas text-xl leading-none ${currentStep >= step.id ? "text-white" : "text-gray-600"}`}>
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{step.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main: Form Content */}
      <div className="lg:col-span-7">
        <form onSubmit={handleSubmit} className="glass-card p-8 sm:p-12">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="font-bebas text-3xl text-white">DATOS PERSONALES</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Nombre Completo</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ej. Juan Pérez"
                      className="input-field-premium"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">WhatsApp</label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="81 1234 5678"
                        className="input-field-premium"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Email</label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@correo.com"
                        className="input-field-premium"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="font-bebas text-3xl text-white">DETALLES DEL SERVICIO</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Tipo de Servicio</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="input-field-premium appearance-none"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                      required
                    >
                      <option value="" className="bg-black">Selecciona una opción</option>
                      <option value="limpieza" className="bg-black">Limpieza Profunda</option>
                      <option value="restauracion" className="bg-black">Restauración de Color</option>
                      <option value="detailing" className="bg-black">Detailing Premium</option>
                      <option value="residencial" className="bg-black">Limpieza Residencial</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Notas adicionales</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Descríbenos el estado de tus artículos..."
                      className="input-field-premium"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="font-bebas text-3xl text-white">UBICACIÓN DE RECOLECCIÓN</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Dirección Completa</label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Calle, Número, Colonia, Municipio"
                      className="input-field-premium"
                      required
                    />
                  </div>
                  <div className="bg-orange-600/10 border border-orange-600/20 p-4 rounded text-sm text-orange-200">
                    <p>ℹ️ Recolectamos en toda el área metropolitana de Monterrey de Lunes a Sábado. También puedes visitar nuestra sucursal en <strong>Puerto Mazatlán 3802, Las Brisas, Mty, NL</strong>.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded text-red-200 text-sm"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <div className="flex gap-4 mt-12 pt-8 border-t border-gray-800">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                className="btn-hero-secondary"
                style={{ flex: 1 }}
              >
                REGRESAR
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-hero-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ flex: 2 }}
            >
              {isSubmitting ? "PROCESANDO..." : currentStep === steps.length ? "FINALIZAR AGENDA" : "CONTINUAR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
