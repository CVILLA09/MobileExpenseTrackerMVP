export function getPeriodLabel(period: "D" | "S" | "M" | "A"): string {
  const today = new Date();
  
  switch (period) {
    case "D":
      return `Hoy ${today.getDate()} de ${today.toLocaleDateString('es-ES', { month: 'short' })}`;
    case "S":
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `Semana ${startOfWeek.getDate()}–${endOfWeek.getDate()}`;
    case "M":
      return `Mes de ${today.toLocaleDateString('es-ES', { month: 'long' })}`;
    case "A":
      return `Año ${today.getFullYear()}`;
    default:
      return "";
  }
}
