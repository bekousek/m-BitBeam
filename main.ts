/**
 * mBitBeam - řízení serva s plynulou rotací přes PCA9685
 */
//% weight=100 color=#0fbc11 icon=""
namespace mBitBeam {

    const CHIP_ADDRESS = 0x40
    const CHIP_RESOLUTION = 4096

    export enum ServoNum {
        Servo1 = 1,
        Servo2 = 2,
        Servo3 = 3,
        Servo4 = 4,
        Servo5 = 5,
        Servo6 = 6,
        Servo7 = 7,
        Servo8 = 8,
        Servo9 = 9,
        Servo10 = 10,
        Servo11 = 11,
        Servo12 = 12,
        Servo13 = 13,
        Servo14 = 14,
        Servo15 = 15,
        Servo16 = 16,
    }

    /**
     * Nastaví rychlost serva s plynulou rotací v rozsahu -100 % až 100 %
     * @param servo Servo, které chceme ovládat; eg: Servo1
     * @param speed Rychlost od -100 do 100; eg: 50
     */
    //% block="nastav rychlost $servo na $speed %"
    //% speed.min=-100 speed.max=100 speed.defl=0
    export function nastavRychlostServa(servo: ServoNum, speed: number): void {
        let pin = servo - 1 // 0–15
        speed = Math.max(-100, Math.min(100, speed))

        const freq = 50
        const minTime = 5      // 0 % - 0 otáček
        const maxTime = 25     // 100 % - max otáčky
        const midTime = 15     // 90° = klidová pozice

        const minOffset = calcOffset(freq, minTime)
        const maxOffset = calcOffset(freq, maxTime)
        const midOffset = calcOffset(freq, midTime)

        let pwm: number
        if (speed == 0) {
            pwm = midOffset
        } else if (speed > 0) {
            pwm = midOffset + ((maxOffset - midOffset) * speed) / 100
        } else {
            pwm = midOffset - ((midOffset - minOffset) * Math.abs(speed)) / 100
        }

        setPinPWM(pin, 0, pwm)
    }

    function setPinPWM(pin: number, on: number, off: number) {
        const base = 0x06 + 4 * pin
        writeRegister(base, on & 0xFF)
        writeRegister(base + 1, (on >> 8) & 0xFF)
        writeRegister(base + 2, off & 0xFF)
        writeRegister(base + 3, (off >> 8) & 0xFF)
    }

    function writeRegister(register: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = register
        buf[1] = value
        pins.i2cWriteBuffer(CHIP_ADDRESS, buf)
    }

    function calcOffset(freq: number, timeMs: number): number {
        return ((timeMs * CHIP_RESOLUTION * freq) / 1000)
    }
}
