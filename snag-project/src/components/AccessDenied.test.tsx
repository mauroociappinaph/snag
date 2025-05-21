import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AccessDenied from './AccessDenied';
import { ROUTES } from '../lib/constants/routes';

// Envolvemos el componente con BrowserRouter para que funcione el Link
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AccessDenied', () => {
  it('renderiza correctamente todos los elementos', () => {
    renderWithRouter(<AccessDenied />);

    // Verificar que el ícono está presente
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('text-red-500');

    // Verificar que el mensaje está presente
    const message = screen.getByText(/No tienes permisos suficientes para acceder a esta página/i);
    expect(message).toBeInTheDocument();

    // Verificar que el botón de "Volver al inicio" está presente
    const backButton = screen.getByRole('link', { name: /Volver al inicio/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute('href', ROUTES.HOME);
  });
});
