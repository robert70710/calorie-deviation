import Foundation

enum DateHelpers {
    /// Israeli week: Sunday–Saturday.
    static var israeliCalendar: Calendar {
        var cal = Calendar(identifier: .gregorian)
        cal.firstWeekday = 1 // Sunday
        cal.locale = Locale(identifier: "he_IL")
        cal.timeZone = TimeZone.current
        return cal
    }

    static func startOfDay(_ date: Date) -> Date {
        israeliCalendar.startOfDay(for: date)
    }

    /// Start of the week containing `date` (Sunday 00:00 local).
    static func startOfWeek(containing date: Date) -> Date {
        let cal = israeliCalendar
        let day = startOfDay(date)
        let weekday = cal.component(.weekday, from: day) // 1 = Sunday … 7 = Saturday
        let daysFromSunday = weekday - 1
        return cal.date(byAdding: .day, value: -daysFromSunday, to: day) ?? day
    }

    /// End of the week (Saturday 23:59:59.999) — exclusive next Sunday for range queries.
    static func endOfWeekExclusive(containing date: Date) -> Date {
        let start = startOfWeek(containing: date)
        return israeliCalendar.date(byAdding: .day, value: 7, to: start) ?? start
    }

    static func startOfMonth(containing date: Date) -> Date {
        let cal = israeliCalendar
        let comps = cal.dateComponents([.year, .month], from: date)
        return cal.date(from: comps) ?? startOfDay(date)
    }

    static func endOfMonthExclusive(containing date: Date) -> Date {
        let start = startOfMonth(containing: date)
        return israeliCalendar.date(byAdding: .month, value: 1, to: start) ?? start
    }

    static func isSameDay(_ a: Date, _ b: Date) -> Bool {
        israeliCalendar.isDate(a, inSameDayAs: b)
    }

    static let dayFormatter: DateFormatter = {
        let f = DateFormatter()
        f.locale = Locale(identifier: "he_IL")
        f.dateStyle = .full
        f.timeStyle = .none
        return f
    }()

    static let shortDayFormatter: DateFormatter = {
        let f = DateFormatter()
        f.locale = Locale(identifier: "he_IL")
        f.dateFormat = "EEEE, d MMMM"
        return f
    }()

    static let historyDayFormatter: DateFormatter = {
        let f = DateFormatter()
        f.locale = Locale(identifier: "he_IL")
        f.dateFormat = "dd/MM/yyyy · EEEE"
        return f
    }()

    static let weekRangeFormatter: DateFormatter = {
        let f = DateFormatter()
        f.locale = Locale(identifier: "he_IL")
        f.dateFormat = "d MMM"
        return f
    }()

    static func weekRangeLabel(containing date: Date) -> String {
        let start = startOfWeek(containing: date)
        let end = israeliCalendar.date(byAdding: .day, value: 6, to: start) ?? start
        return "\(weekRangeFormatter.string(from: start)) – \(weekRangeFormatter.string(from: end))"
    }

    static func monthLabel(containing date: Date) -> String {
        let f = DateFormatter()
        f.locale = Locale(identifier: "he_IL")
        f.dateFormat = "MMMM yyyy"
        return f.string(from: date)
    }
}
