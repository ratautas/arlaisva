const timeZone = 'Europe/Vilnius';

export function getCurrentYear() {
  return new Date().getFullYear();
}

export function getMonthName(date) {
  return date.toLocaleString('lt-LT', { month: 'long', timeZone });
}

export function getWeekdayName(index) {
  const date = new Date(Date.UTC(2024, 0, 1 + index)); // 2024-01-01 is a Monday
  return date.toLocaleString('lt-LT', { weekday: 'short', timeZone });
}

export function getMonthStartDay(year, month) {
  const date = new Date(Date.UTC(year, month, 1));
  let day = date.getUTCDay();
  // Adjust so that Monday is 0, Sunday is 6
  return day === 0 ? 6 : day - 1;
}

export function getDaysInMonth(year, month) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

export function formatDate(date) {
  return date.toLocaleString('lt-LT', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone });
}