import SwiftUI

struct EntryRow: View {
    let entry: DailyEntry

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(DateHelpers.historyDayFormatter.string(from: entry.date))
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(.primary)
                if !entry.notes.isEmpty {
                    Text(entry.notes)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }
            }
            Spacer()
            Text(Formatters.kcal(entry.deviation))
                .font(.body.weight(.semibold).monospacedDigit())
                .foregroundStyle(color)
            Image(systemName: "chevron.left")
                .font(.caption.weight(.semibold))
                .foregroundStyle(.tertiary)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .contentShape(Rectangle())
    }

    private var color: Color {
        if entry.deviation > 0 { return .red }
        if entry.deviation < 0 { return .green }
        return .primary
    }
}
