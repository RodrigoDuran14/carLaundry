export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatPhone = (phone) => {
  if (!phone) return '-';
  return phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');
};

export const formatDni = (dni) => {
  if (!dni) return '-';
  return dni.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
};