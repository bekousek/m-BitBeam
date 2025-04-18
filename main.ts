/**
 * mBitBeam - řízení rychlosti serva s plynulou rotací
 */
//% weight=100 color=#0fbc11 icon=""
namespace mBitBeam {

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
        serial.writeLine(`Servo ${servo}, rychlost ${speed}%`);
        // Zde by byla logika např.:
        // PCA9685.setCRServoPosition(servo, speed, 0x40);
    }
}
