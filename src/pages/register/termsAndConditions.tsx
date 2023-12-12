import React from 'react';
import { Typography } from '@mui/material';

const TerminosCondiciones = () => {
  return (<>
    <Typography style={{ textAlign: 'justify', marginTop: '10px' }}>
      <b>Fecha de Entrada en Vigencia: 10/12/2023</b>
    </Typography>
    <Typography sx={{ marginTop: '10px', marginBottom: '10px' }}>
      <b>Fecha de Última Actualización: 10/12/2023</b>
    </Typography>
    <Typography style={{ textAlign: 'justify' }}>
      Bienvenido a FitBuddy, una plataforma dedicada a conectar a entusiastas del fitness con entrenadores profesionales. Antes de utilizar nuestros servicios, te pedimos que leas y comprendas nuestros términos y condiciones. Al registrarte y utilizar FitBuddy, aceptas automáticamente estos términos. Si no estás de acuerdo con alguna parte de estos términos, no utilices nuestra plataforma.
    </Typography>
    <Typography style={{ textAlign: 'justify', marginTop: '5px' }}>
      <b>1. Uso de la Plataforma y Servicios</b>
      <ul>
        <li>
          <b>1.1 Registro:</b>  Al registrarte en FitBuddy como alumno o entrenador, proporcionas información precisa y actualizada. Mantienes la confidencialidad de tu contraseña y eres responsable de todas las actividades que ocurran en tu cuenta.
        </li>
        <li>
          <b>1.2 Perfil:</b>  Como entrenador, te comprometes a proporcionar información precisa sobre tu experiencia, servicios ofrecidos y precios. Como alumno, eres responsable de definir claramente tus objetivos y preferencias para recibir un plan de entrenamiento adecuado.
        </li>
        <li>
          <b>1.3 Intermediario: </b> FitBuddy actúa como intermediario en la conexión entre alumnos y entrenadores. FitBuddy no se hace responsable de las interacciones, acuerdos o servicios prestados entre alumnos y entrenadores, incluidos los planes de entrenamiento.
        </li>
      </ul>
    </Typography>
    <Typography style={{ textAlign: 'justify' }}>
      <b>2. Planes de Entrenamiento</b>
      <ul>
        <li>
          <b> 2.1 Solicitud y Adecuación:</b> Los alumnos pueden enviar solicitudes con condiciones específicas para los planes de entrenamiento que desean recibir. Los entrenadores se comprometen a ajustar sus planes según las condiciones establecidas por los alumnos en sus solicitudes.
        </li>
        <li>
          <b>2.2 Comunicación Directa:</b>  La comunicación directa entre alumnos y entrenadores es clave para el desarrollo de planes de entrenamiento adecuados. FitBuddy proporciona herramientas de chat y comunicación, pero la negociación y adecuación final de los planes se lleva a cabo entre el alumno y el entrenador.
        </li>
        <li>
          <b>2.3 Vigencia de Comunicación:</b>  La comunicación entre alumno y entrenador, generada por la compra de un plan, tiene una vigencia de un mes. Luego de este periodo, se perderá la comunicación hasta que se adquiera un nuevo plan.
        </li>
      </ul>
    </Typography>
    <Typography style={{ textAlign: 'justify' }}>
      <b>3. Modelo de Monetización</b>
      <ul>
        <li>
          <b> 3.1 Comisiones por Transacción:</b> FitBuddy cobra una comisión del 5% por cada transacción cuando un alumno abona un plan de suscripción al entrenador. Los primeros 10 alumnos de cada entrenador no generan comisiones.
        </li>
        <li>
          <b> 3.2 Facturación y Pagos:</b> Las comisiones se cobran individualmente cada vez que el alumno compra un plan. Los planes tienen una vigencia de un mes, y al expirar, se pierde la comunicación entre alumno y entrenador.
        </li>
      </ul>
    </Typography>
    <Typography style={{ textAlign: 'justify' }}>
      <b>4. Cambios y Actualizaciones</b>
      <ul>
        <li>
          <b>4.1 Ajustes en el Modelo de Monetización:</b>  FitBuddy se reserva el derecho de realizar ajustes en el modelo de monetización. Los entrenadores serán notificados con anticipación sobre cualquier cambio significativo.
        </li>
      </ul>
    </Typography>
    <Typography style={{ textAlign: 'justify' }}>
      <b>5. Limitación de Responsabilidad</b>
      <ul>
        <li>
          <b> 5.1 Intermediario:</b> FitBuddy no se hace responsable de los resultados, lesiones, disputas o cualquier otra situación derivada de la relación entre alumnos y entrenadores. La plataforma facilita la conexión, pero la responsabilidad recae en los usuarios.
        </li>
        <li>
          <b>5.2 Regulación de Precios:</b>  FitBuddy no regula de ninguna forma los precios y condiciones que los entrenadores desean tener en sus suscripciones activas. Estos términos y condiciones son efectivos a partir del 10/12/2023
        </li>
      </ul>
    </Typography>
  </>)

};
export default TerminosCondiciones;

