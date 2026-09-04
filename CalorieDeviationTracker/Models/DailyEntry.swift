import Foundation
import SwiftData

@Model
final class DailyEntry {
    /// Calendar day start (local midnight), used as unique key.
    var date: Date
    /// kcal deviation: positive = over goal, negative = under goal.
    var deviation: Int
    var notes: String
    var updatedAt: Date

    init(date: Date, deviation: Int, notes: String = "") {
        self.date = Calendar.current.startOfDay(for: date)
        self.deviation = deviation
        self.notes = notes
        self.updatedAt = Date()
    }
}

extension DailyEntry: Identifiable {
    var id: PersistentIdentifier { persistentModelID }
}
