
/**
 * mBitBeam - vlastní ovladač pro PCA9685 a další funkce
 */
//% weight=100 color=#0fbc11 icon=""
namespace mBitBeam {

    /**
     * Testovací funkce pro ověření funkčnosti rozšíření
     */
    //% block
    export function testDriver(): void {
        serial.writeLine("Rozšíření mBitBeam-PCA9685 bylo úspěšně načteno.")
    }
}
