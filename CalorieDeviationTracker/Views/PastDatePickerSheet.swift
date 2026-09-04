import SwiftUI

struct PastDatePickerSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Binding var selectedDate: Date
    var onConfirm: (Date) -> Void

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Text("בחרו יום לעריכה או להוספת רישום")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)

                DatePicker(
                    "תאריך",
                    selection: $selectedDate,
                    in: ...Date(),
                    displayedComponents: [.date]
                )
                .datePickerStyle(.graphical)
                .environment(\.layoutDirection, .rightToLeft)
                .environment(\.locale, Locale(identifier: "he_IL"))
                .padding(.horizontal)

                Button {
                    onConfirm(selectedDate)
                    dismiss()
                } label: {
                    Text("המשך")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                }
                .buttonStyle(.borderedProminent)
                .tint(.orange)
                .padding(.horizontal, 20)

                Spacer()
            }
            .padding(.top, 12)
            .navigationTitle("יום קודם")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("ביטול") { dismiss() }
                }
            }
            .environment(\.layoutDirection, .rightToLeft)
        }
        .presentationDetents([.medium, .large])
    }
}
