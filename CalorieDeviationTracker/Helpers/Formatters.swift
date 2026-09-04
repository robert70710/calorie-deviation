import Foundation

enum Formatters {
    /// Western digits, Hebrew-friendly sign display.
    static func kcal(_ value: Int) -> String {
        let absStr = String(abs(value))
        if value > 0 {
            return "+\(absStr)"
        } else if value < 0 {
            return "−\(absStr)"
        } else {
            return "0"
        }
    }

    static func kcalWithUnit(_ value: Int) -> String {
        "\(kcal(value)) קק״ל"
    }
}
