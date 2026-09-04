import SwiftUI
import SwiftData

struct ContentView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \DailyEntry.date, order: .reverse) private var entries: [DailyEntry]

    @State private var showTodayEditor = false
    @State private var editingEntry: DailyEntry?
    @State private var editorDateForNew: Date?
    @State private var showHistory = false
    @State private var selectedPastDate = Date()
    @State private var showPastDatePicker = false

    private var today: Date { DateHelpers.startOfDay(Date()) }

    private var todayEntry: DailyEntry? {
        entries.first { DateHelpers.isSameDay($0.date, today) }
    }

    private var weekTotal: Int {
        let start = DateHelpers.startOfWeek(containing: today)
        let end = DateHelpers.endOfWeekExclusive(containing: today)
        return entries
            .filter { $0.date >= start && $0.date < end }
            .reduce(0) { $0 + $1.deviation }
    }

    private var monthTotal: Int {
        let start = DateHelpers.startOfMonth(containing: today)
        let end = DateHelpers.endOfMonthExclusive(containing: today)
        return entries
            .filter { $0.date >= start && $0.date < end }
            .reduce(0) { $0 + $1.deviation }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    headerSection
                    totalsSection
                    todayCard
                    recentSection
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 16)
            }
            .background(Color(.systemGroupedBackground).ignoresSafeArea())
            .navigationTitle("מעקב סטיית קלוריות")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button {
                        showHistory = true
                    } label: {
                        Label("היסטוריה", systemImage: "list.bullet")
                    }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showPastDatePicker = true
                    } label: {
                        Label("יום קודם", systemImage: "calendar.badge.plus")
                    }
                }
            }
            .sheet(isPresented: $showTodayEditor) {
                EntryEditorView(
                    date: today,
                    existing: todayEntry
                )
            }
            .sheet(item: $editingEntry) { entry in
                EntryEditorView(date: entry.date, existing: entry)
            }
            .sheet(item: $editorDateForNew) { wrap in
                EntryEditorView(date: wrap.date, existing: nil)
            }
            .sheet(isPresented: $showHistory) {
                NavigationStack {
                    HistoryView()
                }
            }
            .sheet(isPresented: $showPastDatePicker) {
                PastDatePickerSheet(selectedDate: $selectedPastDate) { date in
                    let day = DateHelpers.startOfDay(date)
                    if let existing = entries.first(where: { DateHelpers.isSameDay($0.date, day) }) {
                        editingEntry = existing
                    } else {
                        editorDateForNew = DateWrap(date: day)
                    }
                }
            }
        }
    }

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(DateHelpers.shortDayFormatter.string(from: today))
                .font(.subheadline)
                .foregroundStyle(.secondary)
            Text("סטייה יומית מהיעד")
                .font(.title3.weight(.semibold))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var totalsSection: some View {
        VStack(spacing: 12) {
            TotalCard(
                title: "סכום שבועי",
                subtitle: "ראשון–שבת · \(DateHelpers.weekRangeLabel(containing: today))",
                value: weekTotal,
                systemImage: "calendar"
            )
            TotalCard(
                title: "סכום חודשי",
                subtitle: DateHelpers.monthLabel(containing: today),
                value: monthTotal,
                systemImage: "calendar.circle"
            )
        }
    }

    private var todayCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("היום")
                        .font(.headline)
                    if let entry = todayEntry {
                        Text(Formatters.kcalWithUnit(entry.deviation))
                            .font(.system(size: 36, weight: .bold, design: .rounded))
                            .foregroundStyle(deviationColor(entry.deviation))
                            .monospacedDigit()
                    } else {
                        Text("עדיין לא נרשם")
                            .font(.title3)
                            .foregroundStyle(.secondary)
                    }
                }
                Spacer()
                Image(systemName: "flame.fill")
                    .font(.system(size: 32))
                    .foregroundStyle(.orange.gradient)
            }

            Button {
                showTodayEditor = true
            } label: {
                Label(
                    todayEntry == nil ? "רשום סטייה להיום" : "ערוך סטייה להיום",
                    systemImage: todayEntry == nil ? "plus.circle.fill" : "pencil.circle.fill"
                )
                .font(.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
            }
            .buttonStyle(.borderedProminent)
            .tint(.orange)
            .controlSize(.large)
        }
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color(.secondarySystemGroupedBackground))
        )
    }

    private var recentSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("רישומים אחרונים")
                    .font(.headline)
                Spacer()
                if !entries.isEmpty {
                    Button("הכל") { showHistory = true }
                        .font(.subheadline)
                }
            }

            if entries.isEmpty {
                ContentUnavailableView(
                    "אין רישומים עדיין",
                    systemImage: "chart.line.flattrend.xyaxis",
                    description: Text("לחצו על \"רשום סטייה להיום\" כדי להתחיל")
                )
                .frame(maxWidth: .infinity)
                .padding(.vertical, 24)
            } else {
                VStack(spacing: 0) {
                    ForEach(Array(entries.prefix(7)), id: \.persistentModelID) { entry in
                        Button {
                            editingEntry = entry
                        } label: {
                            EntryRow(entry: entry)
                        }
                        .buttonStyle(.plain)
                        if entry.persistentModelID != entries.prefix(7).last?.persistentModelID {
                            Divider().padding(.leading, 12)
                        }
                    }
                }
                .background(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .fill(Color(.secondarySystemGroupedBackground))
                )
            }
        }
    }

    private func deviationColor(_ value: Int) -> Color {
        if value > 0 { return .red }
        if value < 0 { return .green }
        return .primary
    }
}

/// Identifiable wrapper so we can present the editor for a new date without pre-inserting.
struct DateWrap: Identifiable {
    let id = UUID()
    let date: Date
}

#Preview {
    ContentView()
        .modelContainer(for: DailyEntry.self, inMemory: true)
        .environment(\.layoutDirection, .rightToLeft)
        .environment(\.locale, Locale(identifier: "he_IL"))
}
