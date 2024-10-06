import { formatDate } from './dateUtils.js';

function calculateEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(Date.UTC(year, month - 1, day));
}

export function getHolidays(year) {
  const holidays = [
    { date: new Date(Date.UTC(year, 0, 1)), name: "Naujieji metai" },
    { date: new Date(Date.UTC(year, 1, 16)), name: "Lietuvos valstybės atkūrimo diena" },
    { date: new Date(Date.UTC(year, 2, 11)), name: "Lietuvos nepriklausomybės atkūrimo diena" },
    { date: new Date(Date.UTC(year, 4, 1)), name: "Tarptautinė darbo diena" },
    { date: new Date(Date.UTC(year, 5, 24)), name: "Joninės, Rasos" },
    { date: new Date(Date.UTC(year, 6, 6)), name: "Valstybės (Lietuvos karaliaus Mindaugo karūnavimo) diena" },
    { date: new Date(Date.UTC(year, 7, 15)), name: "Žolinė (Švč. Mergelės Marijos ėmimo į dangų diena)" },
    { date: new Date(Date.UTC(year, 10, 1)), name: "Visų šventųjų diena" },
    { date: new Date(Date.UTC(year, 11, 24)), name: "Kūčios" },
    { date: new Date(Date.UTC(year, 11, 25)), name: "Kalėdos (Pirma diena)" },
    { date: new Date(Date.UTC(year, 11, 26)), name: "Kalėdos (Antra diena)" },
  ];

  // Add Easter Sunday and Easter Monday
  const easterSunday = calculateEaster(year);
  const easterMonday = new Date(easterSunday.getTime() + 24 * 60 * 60 * 1000);
  holidays.push({ date: easterSunday, name: "Velykos (Šv. Velykos)" });
  holidays.push({ date: easterMonday, name: "Velykų antroji diena" });

  // Sort holidays by date
  holidays.sort((a, b) => a.date - b.date);

  const prevYearHolidays = [
    { date: new Date(Date.UTC(year-1, 11, 24)), name: "Kūčios" },
    { date: new Date(Date.UTC(year-1, 11, 25)), name: "Kalėdos (Pirma diena)" },
    { date: new Date(Date.UTC(year-1, 11, 26)), name: "Kalėdos (Antra diena)" },
    { date: new Date(Date.UTC(year-1, 11, 31)), name: "Naujųjų metų išvakarės" },
  ];

  const nextYearHolidays = [
    { date: new Date(Date.UTC(year+1, 0, 1)), name: "Naujieji metai" },
  ];

  return [...prevYearHolidays, ...holidays, ...nextYearHolidays].map(h => ({
    ...h,
    date: formatDate(h.date)
  }));
}

export function getExtendedWeekends(year) {
  const holidays = getHolidays(year);
  const extendedWeekends = [];
  const extraExtendedWeekends = [];

  function isDayOff(date) {
    const day = date.getUTCDay();
    const dateString = formatDate(date);
    return day === 0 || day === 6 || holidays.some(h => h.date === dateString);
  }

  function checkConsecutiveDaysOff(date, count) {
    for (let i = 0; i < count; i++) {
      const checkDate = new Date(date.getTime() + i * 24 * 60 * 60 * 1000);
      if (!isDayOff(checkDate)) return false;
    }
    return true;
  }

  for (let month = -1; month < 13; month++) {
    for (let day = 1; day <= 31; day++) {
      const date = new Date(Date.UTC(year, month, day));
      if (date.getUTCMonth() !== month) continue;

      if (!isDayOff(date)) {
        const prevDay = new Date(date.getTime() - 24 * 60 * 60 * 1000);
        const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        const twoNextDays = new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000);

        // Check for extended weekend (4+ days off with 1 day taken)
        if ((isDayOff(prevDay) && checkConsecutiveDaysOff(nextDay, 2)) ||
            (checkConsecutiveDaysOff(prevDay, 2) && isDayOff(nextDay)) ||
            (isDayOff(prevDay) && isDayOff(nextDay))) {
          extendedWeekends.push(formatDate(date));
        }

        // Check for extra extended weekend (5+ days off with 2 days taken)
        if ((isDayOff(prevDay) && !isDayOff(nextDay) && isDayOff(twoNextDays)) ||
            (checkConsecutiveDaysOff(prevDay, 2) && !isDayOff(nextDay) && isDayOff(twoNextDays))) {
          extraExtendedWeekends.push(formatDate(date));
          extraExtendedWeekends.push(formatDate(nextDay));
        }
      }
    }
  }

  return { extendedWeekends, extraExtendedWeekends };
}