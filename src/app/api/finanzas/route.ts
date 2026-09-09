import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const mainUrl = process.env.NEXT_PUBLIC_SUPABASE_MAIN_URL || '';
const mainKey = process.env.NEXT_PUBLIC_SUPABASE_MAIN_ANON_KEY || '';
const supabase = createClient(mainUrl, mainKey);

// DOMINIO DE CORREO: Ya que registraste este dominio en Resend, funcionará
const FROM_EMAIL = "Sneakerz <contacto@sneakerz.mx>";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre_registro, descripcion, monto_cobrar, adelanto, contacto, estatus } = body;

    const initialEstatus = estatus || "Inicio";

    // 1. Insertar en Supabase
    const { data: record, error: dbError } = await supabase
      .from("Finanzas")
      .insert([{
        nombre_registro,
        descripcion,
        monto_cobrar,
        adelanto,
        contacto,
        estatus: initialEstatus
      }])
      .select()
      .single();

    if (dbError) {
      if (dbError.code === "42P01") {
        return NextResponse.json({ error: "La tabla 'Finanzas' no existe en Supabase. Por favor ejecuta el script SQL." }, { status: 400 });
      }
      throw new Error(`Error en Base de Datos: ${dbError.message}`);
    }

    // 2. Enviar correo usando Resend si el contacto es un email válido
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto);
    let emailEnviado = false;
    
    if (isEmail) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #ff5500;">Hola, ${nombre_registro}</h2>
          <p>Hemos registrado tu servicio exitosamente en <strong>Sneakerz</strong>.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Servicio:</strong> ${descripcion}</p>
            <p><strong>Estatus actual:</strong> <span style="color: #ff5500; font-weight: bold;">${initialEstatus}</span></p>
            <p><strong>Monto Total:</strong> $${monto_cobrar.toFixed(2)}</p>
            <p><strong>Adelanto/Apartado:</strong> $${adelanto.toFixed(2)}</p>
            <p><strong>Restante a pagar:</strong> $${(monto_cobrar - adelanto).toFixed(2)}</p>
          </div>
          <p>Te avisaremos por este medio cuando cambie el estatus de tu servicio. ¡Gracias por confiar en Sneakerz!</p>
        </div>
      `;

      const { error: resendError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: [contacto],
        subject: "Registro de Servicio - Sneakerz",
        html: emailHtml,
      });

      if (!resendError) emailEnviado = true;
    }

    return NextResponse.json({ success: true, record, emailEnviado });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, estatus, nombre_registro, descripcion, contacto } = body;

    if (!id || !estatus) {
      return NextResponse.json({ error: "Faltan datos para actualizar" }, { status: 400 });
    }

    // 1. Actualizar estatus en Supabase
    const { data: record, error: dbError } = await supabase
      .from("Finanzas")
      .update({ estatus })
      .eq("id", id)
      .select()
      .single();

    if (dbError) throw new Error(`Error actualizando Base de Datos: ${dbError.message}`);

    // 2. Enviar correo de notificación
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto);
    let emailEnviado = false;
    
    if (isEmail) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #ff5500;">Actualización de Servicio, ${nombre_registro}</h2>
          <p>Tu servicio en <strong>Sneakerz</strong> ha cambiado de estatus.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff5500;">
            <p><strong>Servicio:</strong> ${descripcion}</p>
            <p><strong>Nuevo Estatus:</strong> <span style="color: #ff5500; font-weight: bold;">${estatus}</span></p>
          </div>
          <p>Si tienes alguna duda, puedes contactarnos respondiendo a este correo o por WhatsApp.</p>
          <p>¡Gracias por tu confianza!</p>
        </div>
      `;

      const { error: resendError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: [contacto],
        subject: `Actualización: ${estatus} - Sneakerz`,
        html: emailHtml,
      });

      if (!resendError) emailEnviado = true;
    }

    return NextResponse.json({ success: true, record, emailEnviado });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
