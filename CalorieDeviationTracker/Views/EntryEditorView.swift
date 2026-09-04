import SwiftUI
import SwiftData

struct EntryEditorView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss

    let date: Date
    let existing: DailyEntry?

    @State private var deviationText: String = ""
    @State private var notes: String = ""
    @State private var isPositive = true
    @FocusState private var focusedField: Field?

    private enum Field { case deviation, notes }

    private var dayStart: Date { DateHelpers.startOfDay(date) }

    private var title: String {
        if DateHelpers.isSameDay(dayStart, Date()) {
            return "סטייה להיום"
        }
        return "עריכת יום"
    }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Text(DateHelpers.dayFormatter.string(from: dayStart))
                        .foregroundStyle(.secondary)
                } header: {
                    Text("תאריך")
                }

                Section {
                    Picker("כיוון", selection: $isPositive) {
                        Text("מעל היעד (+)").tag(true)
                        Text("מתחת ליעד (−)").tag(false)
                    }
                    .pickerStyle(.segmented)

                    HStack {
                        TextField("0", text: $deviationText)
                            .keyboardType(.numberPad)
                            .font(.system(size: 40, weight: .bold, design: .rounded))
                            .multilineTextAlignment(.center)
                            .focused($focusedField, equals: .deviation)
                            .monospacedDigit()
                        Text("קק״ל")
                            .foregroundStyle(.secondary)
                    }

                    Text("חיובי = אכלתם יותר מהיעד · שלילי = פחות מהיעד")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                } header: {
                    Text("סטייה בקלוריות")
                }

                Section {
                    TextField("הערה אופציונלית", text: $notes, axis: .vertical)
                        .lineLimit(2...4)
                        .focused($focusedField, equals: .notes)
                } header: {
                    Text("הערות")
                }

                if existing != nil {
                    Section {
                        Button(role: .destructive) {
                            deleteEntry()
                        } label: {
                            Label("מחק רישום", systemImage: "trash")
                        }
                    }
                }
            }
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("ביטול") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("שמור") { save() }
                        .fontWeight(.semibold)
                }
                ToolbarItemGroup(placement: .keyboard) {
                    Spacer()
                    Button("סיום") { focusedField = nil }
                }
            }
            .onAppear {
                if let existing {
                    let v = existing.deviation
                    isPositive = v >= 0
                    deviationText = String(abs(v))
                    notes = existing.notes
                } else {
                    isPositive = true
                    deviationText = ""
                    notes = ""
                }
                focusedField = .deviation
            }
            .environment(\.layoutDirection, .rightToLeft)
        }
        .presentationDetents([.large])
    }

    private func parsedMagnitude() -> Int {
        let digits = deviationText.filter(\.isNumber)
        return Int(digits) ?? 0
    }

    private func signedDeviation() -> Int {
        let mag = parsedMagnitude()
        return isPositive ? mag : -mag
    }

    private func save() {
        let value = signedDeviation()
        let trimmed = notes.trimmingCharacters(in: .whitespacesAndNewlines)
        if let existing {
            existing.deviation = value
            existing.notes = trimmed
            existing.updatedAt = Date()
        } else {
            // Avoid duplicate day if one was created elsewhere
            let descriptor = FetchDescriptor<DailyEntry>()
            let all = (try? modelContext.fetch(descriptor)) ?? []
            if let found = all.first(where: { DateHelpers.isSameDay($0.date, dayStart) }) {
                found.deviation = value
                found.notes = trimmed
                found.updatedAt = Date()
            } else {
                let entry = DailyEntry(date: dayStart, deviation: value, notes: trimmed)
                modelContext.insert(entry)
            }
        }
        try? modelContext.save()
        dismiss()
    }

    private func deleteEntry() {
        if let existing {
            modelContext.delete(existing)
            try? modelContext.save()
        }
        dismiss()
    }
}
