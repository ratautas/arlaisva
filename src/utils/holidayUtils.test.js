import { describe, it, expect } from 'vitest';
import { getHolidays, getExtendedWeekends } from './holidayUtils';

describe('Holiday Utilities', () => {
  const years = [2024, 2025, 2026, 2027, 2028, 2029];

  describe('getHolidays', () => {
    years.forEach(year => {
      it(`should return correct holidays for ${year}`, () => {
        const holidays = getHolidays(year);
        
        // Test for specific holidays
        expect(holidays).toContainEqual({ date: `${year}-01-01`, name: "Naujieji metai" });
        expect(holidays).toContainEqual({ date: `${year}-02-16`, name: "Lietuvos valstybės atkūrimo diena" });
        expect(holidays).toContainEqual({ date: `${year}-03-11`, name: "Lietuvos nepriklausomybės atkūrimo diena" });
        expect(holidays).toContainEqual({ date: `${year}-05-01`, name: "Tarptautinė darbo diena" });
        expect(holidays).toContainEqual({ date: `${year}-06-24`, name: "Joninės, Rasos" });
        expect(holidays).toContainEqual({ date: `${year}-07-06`, name: "Valstybės (Lietuvos karaliaus Mindaugo karūnavimo) diena" });
        expect(holidays).toContainEqual({ date: `${year}-08-15`, name: "Žolinė (Švč. Mergelės Marijos ėmimo į dangų diena)" });
        expect(holidays).toContainEqual({ date: `${year}-11-01`, name: "Visų šventųjų diena" });
        expect(holidays).toContainEqual({ date: `${year}-12-24`, name: "Kūčios" });
        expect(holidays).toContainEqual({ date: `${year}-12-25`, name: "Kalėdos (Pirma diena)" });
        expect(holidays).toContainEqual({ date: `${year}-12-26`, name: "Kalėdos (Antra diena)" });

        // Test for Easter (date varies each year)
        const easterHoliday = holidays.find(h => h.name === "Velykos (Šv. Velykos)");
        expect(easterHoliday).toBeDefined();
        expect(new Date(easterHoliday.date).getFullYear()).toBe(year);

        // Test for Easter Monday
        const easterMondayHoliday = holidays.find(h => h.name === "Velykų antroji diena");
        expect(easterMondayHoliday).toBeDefined();
        expect(new Date(easterMondayHoliday.date).getFullYear()).toBe(year);

        // Test for previous year's last days
        expect(holidays).toContainEqual({ date: `${year-1}-12-31`, name: "Naujųjų metų išvakarės" });

        // Test for next year's first day
        expect(holidays).toContainEqual({ date: `${year+1}-01-01`, name: "Naujieji metai" });

        // Ensure no duplicate dates
        const uniqueDates = new Set(holidays.map(h => h.date));
        expect(uniqueDates.size).toBe(holidays.length);
      });
    });
  });

  describe('getExtendedWeekends', () => {
    years.forEach(year => {
      it(`should return correct extended and extra extended weekends for ${year}`, () => {
        const { extendedWeekends, extraExtendedWeekends } = getExtendedWeekends(year);

        // Test for specific extended weekends (this will vary by year)
        const expectedExtendedWeekends = getExpectedExtendedWeekends(year);
        expectedExtendedWeekends.forEach(date => {
          expect(extendedWeekends).toContain(date);
        });

        // Test for specific extra extended weekends (this will vary by year)
        const expectedExtraExtendedWeekends = getExpectedExtraExtendedWeekends(year);
        expectedExtraExtendedWeekends.forEach(date => {
          expect(extraExtendedWeekends).toContain(date);
        });

        // Ensure no overlap between extended and extra extended weekends
        const overlap = extendedWeekends.filter(date => extraExtendedWeekends.includes(date));
        expect(overlap).toHaveLength(0);

        // Check that all dates are within the correct year
        const allDates = [...extendedWeekends, ...extraExtendedWeekends];
        allDates.forEach(date => {
          expect(new Date(date).getFullYear()).toBe(year);
        });
      });
    });
  });
});

function getExpectedExtendedWeekends(year) {
  // This function should return an array of expected extended weekend dates for the given year
  // You'll need to manually calculate these for each year
  const expectedDates = {
    2024: ['2024-02-16', '2024-03-11', '2024-05-03', '2024-06-24', '2024-07-05', '2024-08-16', '2024-11-04', '2024-12-24'],
    2025: ['2025-02-14', '2025-03-10', '2025-05-02', '2025-06-23', '2025-07-07', '2025-08-15', '2025-10-31', '2025-12-24'],
    2026: ['2026-02-13', '2026-03-13', '2026-05-04', '2026-06-26', '2026-07-03', '2026-08-14', '2026-10-30', '2026-12-24'],
    2027: ['2027-02-12', '2027-03-12', '2027-04-30', '2027-06-25', '2027-07-05', '2027-08-13', '2027-11-02', '2027-12-24'],
    2028: ['2028-02-16', '2028-03-10', '2028-05-01', '2028-06-23', '2028-07-07', '2028-08-15', '2028-10-31', '2028-12-22'],
    2029: ['2029-02-16', '2029-03-09', '2029-05-04', '2029-06-22', '2029-07-06', '2029-08-17', '2029-11-02', '2029-12-24'],
  };
  return expectedDates[year] || [];
}

function getExpectedExtraExtendedWeekends(year) {
  // This function should return an array of expected extra extended weekend dates for the given year
  // You'll need to manually calculate these for each year
  const expectedDates = {
    2024: ['2024-04-29', '2024-04-30', '2024-12-30', '2024-12-31'],
    2025: ['2025-04-28', '2025-04-29', '2025-12-29', '2025-12-30'],
    2026: ['2026-04-30', '2026-05-04', '2026-12-28', '2026-12-29'],
    2027: ['2027-04-29', '2027-04-30', '2027-12-30', '2027-12-31'],
    2028: ['2028-05-01', '2028-05-02', '2028-12-28', '2028-12-29'],
    2029: ['2029-04-26', '2029-04-27', '2029-12-27', '2029-12-28'],
  };
  return expectedDates[year] || [];
}