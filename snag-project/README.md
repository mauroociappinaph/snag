# Snag - SaaS Reservation System

## Overview

**Snag** is a Software as a Service (SaaS) platform for managing appointments and bookings for service-based businesses such as hair salons, barber shops, fitness trainers, and more. This web application allows businesses to streamline their booking process while providing an easy-to-use interface for clients to reserve their appointments.

## Features

- **Admin Role**: Admins will have restricted access (only accessible by the platform owner) to manage global settings, monitor businesses, and manage users.

- **Business Role**: Businesses (e.g., salons, trainers, etc.) have access to manage their own appointments, staff, and customer bookings. They can view, edit, and delete their bookings, manage available time slots, and set services.

- **Client Role**: Clients can book, view, and manage their own appointments with businesses. They can choose a service, check availability, and make reservations.

## Business Logic

1. **User Roles**: Snag supports three primary user roles:

   - **Admin**: Admins will have access only to the global management settings of the platform (limited access to the platform owner).
   - **Business**: A business can manage its own operations, including scheduling appointments, managing staff, and handling customer bookings. Each business has an independent dashboard.
   - **Client**: Clients are able to browse available businesses and book appointments. They have a personal dashboard to manage their own bookings.

2. **User Authentication and Authorization**:

   - **Authentication**: All users (Admins, Businesses, and Clients) authenticate using email and password. After successful login, the user receives a JSON Web Token (JWT) that provides secure access to the application.
   - **Authorization**: The system ensures that users can only access features specific to their roles:
     - Admins have access to platform management (for platform owner use only).
     - Businesses can manage only their own bookings and schedules.
     - Clients can only access their own bookings and related information.

3. **Booking Flow**:

   - Clients choose a business and available service, view available time slots, and book an appointment.
   - Businesses manage available time slots, services, and staff members.
   - Admins oversee global platform settings and monitoring.

4. **Database Structure**:

   - **Users**: The `users` table stores user details such as name, email, password (encrypted), and role (Admin, Business, or Client).
   - **Businesses**: Each business is represented in the `businesses` table, with information like business name, address, available services, and linked staff members.
   - **Appointments**: The `appointments` table stores booking details such as date, time, client ID, business ID, and service type.

5. **Booking Management**:
   - Clients can make, update, or cancel appointments.
   - Businesses have a calendar view to see and manage all their appointments.
   - Businesses and clients can receive notifications for appointment confirmations, cancellations, and reminders.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

# Snag - Sistema SaaS de Reservas

## Visión General

**Snag** es una plataforma de Software como Servicio (SaaS) para gestionar citas y reservas en negocios de servicios como peluquerías, barberías, entrenadores personales, entre otros. Esta aplicación web permite a los negocios optimizar su proceso de reservas, mientras que ofrece una interfaz fácil de usar para que los clientes reserven sus citas.

## Características

- **Rol de Administrador**: Los administradores tendrán acceso restringido (solo accesible por el propietario de la plataforma) para gestionar configuraciones globales, supervisar comercios y gestionar usuarios.

- **Rol de Comercio**: Los comercios (por ejemplo, peluquerías, entrenadores, etc.) tienen acceso para gestionar sus propias citas, personal y reservas de clientes. Pueden ver, editar y eliminar sus reservas, gestionar los horarios disponibles y definir los servicios.

- **Rol de Cliente**: Los clientes pueden reservar, ver y gestionar sus propias citas con los comercios. Pueden elegir un servicio, ver la disponibilidad y hacer reservas.

## Lógica de Negocio

1. **Roles de Usuario**: Snag soporta tres roles de usuario principales:

   - **Administrador**: Los administradores tendrán acceso solo a la gestión global de la plataforma (acceso limitado solo para el propietario de la plataforma).
   - **Comercio**: Un comercio puede gestionar sus propias operaciones, incluyendo la programación de citas, la gestión de personal y el manejo de reservas de clientes. Cada comercio tiene su propio panel de control.
   - **Cliente**: Los clientes pueden navegar por los negocios disponibles y realizar reservas. Tienen un panel personal para gestionar sus propias citas.

2. **Autenticación y Autorización de Usuarios**:

   - **Autenticación**: Todos los usuarios (Administradores, Comercios y Clientes) se autentican utilizando correo electrónico y contraseña. Después de un inicio de sesión exitoso, el usuario recibe un JSON Web Token (JWT) que proporciona acceso seguro a la aplicación.
   - **Autorización**: El sistema asegura que los usuarios solo puedan acceder a funciones específicas para sus roles:
     - Los **Administradores** solo tienen acceso a la gestión global de la plataforma (para el uso exclusivo del propietario).
     - Los **Comercios** solo pueden gestionar sus propias citas y horarios.
     - Los **Clientes** solo pueden acceder a sus propias citas e información relacionada.

3. **Flujo de Reservas**:

   - Los clientes eligen un negocio y servicio disponible, visualizan los horarios y reservan una cita.
   - Los comercios gestionan los horarios disponibles, los servicios y los miembros del personal.
   - Los administradores supervisan la configuración global de la plataforma y las reservas.

4. **Estructura de Base de Datos**:

   - **Usuarios**: La tabla `users` almacena los detalles de los usuarios como nombre, correo electrónico, contraseña (encriptada) y rol (Administrador, Comercio o Cliente).
   - **Comercios**: Cada comercio está representado en la tabla `businesses`, con información como el nombre del comercio, dirección, servicios disponibles y miembros del personal asignados.
   - **Citas**: La tabla `appointments` almacena los detalles de las reservas como fecha, hora, ID del cliente, ID del comercio y tipo de servicio.

5. **Gestión de Reservas**:
   - Los clientes pueden hacer, actualizar o cancelar citas.
   - Los comercios tienen una vista de calendario para ver y gestionar todas sus citas.
   - Los comercios y clientes pueden recibir notificaciones para confirmaciones de citas, cancelaciones y recordatorios.

## Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.
