import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Sneakerz <contacto@sneakerz.mx>";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, service, address, notes } = body;

    // Destinatarios fijos (Admins)
    const toEmails = ["vidalcavazos@gmail.com", "soymikevazquez@gmail.com"];
    
    // Validar si el usuario dejó un email para agregarlo a la lista de destinos
    const isEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (isEmail) {
      toEmails.push(email);
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #ff5500; font-family: 'Arial Black', sans-serif; text-transform: uppercase;">NUEVA CITA DE RECOLECCIÓN</h2>
        </div>
        
        <p>Hola, hemos recibido una nueva solicitud de agenda en <strong>Sneakerz</strong>.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff5500;">
          <h3 style="margin-top: 0; color: #111;">Datos del Cliente</h3>
          <p style="margin: 5px 0;"><strong>Nombre:</strong> ${name}</p>
          <p style="margin: 5px 0;"><strong>WhatsApp:</strong> ${phone}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email || 'No proporcionado'}</p>
          
          <h3 style="margin-top: 20px; color: #111;">Detalles del Servicio</h3>
          <p style="margin: 5px 0;"><strong>Tipo de Servicio:</strong> <span style="text-transform: capitalize;">${service}</span></p>
          <p style="margin: 5px 0;"><strong>Dirección de Recolección:</strong> ${address}</p>
          <p style="margin: 5px 0;"><strong>Notas:</strong> ${notes || 'Ninguna'}</p>
        </div>
        
        <p style="font-size: 0.9em; color: #666; text-align: center; margin-top: 30px;">
          Este correo es una notificación automática del sistema de agendamiento de Sneakerz.
        </p>
      </div>
    `;

    const { error: resendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmails,
      subject: `Nueva Recolección Sneakerz - ${name}`,
      html: emailHtml,
    });

    if (resendError) {
      throw new Error(`Error enviando correo: ${resendError.message}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
