/**
 * Bloky pro ovládání serva
 */
//% weight=100 color=#000000 icon="" block="m-Bit pokročilý"
namespace mBitBeam {
    let _DEBUG: boolean = false
    const debug = (msg: string) => {
        if (_DEBUG === true) {
            serial.writeLine(msg)
        }
    }

    const MIN_CHIP_ADDRESS = 0x40
    const MAX_CHIP_ADDRESS = MIN_CHIP_ADDRESS + 62
    const chipResolution = 4096;
    const PrescaleReg = 0xFE //the prescale register address
    const modeRegister1 = 0x00 // MODE1
    const modeRegister1Default = 0x01
    const modeRegister2 = 0x01 // MODE2
    const modeRegister2Default = 0x04
    const sleep = modeRegister1Default | 0x10; // Set sleep bit to 1
    const wake = modeRegister1Default & 0xEF; // Set sleep bit to 0
    const restart = wake | 0x80; // Set restart bit to 1
    const allChannelsOnStepLowByte = 0xFA // ALL_LED_ON_L
    const allChannelsOnStepHighByte = 0xFB // ALL_LED_ON_H
    const allChannelsOffStepLowByte = 0xFC // ALL_LED_OFF_L
    const allChannelsOffStepHighByte = 0xFD // ALL_LED_OFF_H
    const PinRegDistance = 4
    const channel0OnStepLowByte = 0x06 // LED0_ON_L
    const channel0OnStepHighByte = 0x07 // LED0_ON_H
    const channel0OffStepLowByte = 0x08 // LED0_OFF_L
    const channel0OffStepHighByte = 0x09 // LED0_OFF_H

    const hexChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']

    /*
        export enum HexValue {
            h0 = 0,
            h1 = 1,
            h2 = 2,
            h3 = 3,
            h4 = 4,
            h5 = 5,
            h6 = 6,
            h7 = 7,
            h8 = 8,
            h9 = 9,
            hA = 10,
            hB = 11,
            hC = 12,
            hD = 13,
            hE = 14,
            hF = 15
        }

        export enum ChipAddress {
            hex_0x40 = 0x40,
            hex_0x41 = 0x41,
            hex_0x42 = 0x42,
            hex_0x43 = 0x43,
            hex_0x44 = 0x44,
            hex_0x45 = 0x45,
            hex_0x46 = 0x46,
            hex_0x47 = 0x47,
            hex_0x48 = 0x48,
            hex_0x49 = 0x49,
            hex_0x4A = 0x4A,
            hex_0x4B = 0x4B,
            hex_0x4C = 0x4C,
            hex_0x4D = 0x4D,
            hex_0x4E = 0x4E,
            hex_0x4F = 0x4F,
            hex_0x50 = 0x50,
            hex_0x51 = 0x51,
            hex_0x52 = 0x52,
            hex_0x53 = 0x53,
            hex_0x54 = 0x54,
            hex_0x55 = 0x55,
            hex_0x56 = 0x56,
            hex_0x57 = 0x57,
            hex_0x58 = 0x58,
            hex_0x59 = 0x59,
            hex_0x5A = 0x5A,
            hex_0x5B = 0x5B,
            hex_0x5C = 0x5C,
            hex_0x5D = 0x5D,
            hex_0x5E = 0x5E,
            hex_0x5F = 0x5F,
            hex_0x60 = 0x60,
            hex_0x61 = 0x61,
            hex_0x62 = 0x62,
            hex_0x63 = 0x63,
            hex_0x64 = 0x64,
            hex_0x65 = 0x65,
            hex_0x66 = 0x66,
            hex_0x67 = 0x67,
            hex_0x68 = 0x68,
            hex_0x69 = 0x69,
            hex_0x6A = 0x6A,
            hex_0x6B = 0x6B,
            hex_0x6C = 0x6C,
            hex_0x6D = 0x6D,
            hex_0x6E = 0x6E,
            hex_0x6F = 0x6F,
            hex_0x70 = 0x70,
            hex_0x71 = 0x71,
            hex_0x72 = 0x72,
            hex_0x73 = 0x73,
            hex_0x74 = 0x74,
            hex_0x75 = 0x75,
            hex_0x76 = 0x76,
            hex_0x77 = 0x77,
            hex_0x78 = 0x78,
            hex_0x79 = 0x79,
            hex_0x7A = 0x7A,
            hex_0x7B = 0x7B,
            hex_0x7C = 0x7C,
            hex_0x7D = 0x7D,
        }
    */

    export enum PinNum {
        Pin0 = 0,
        Pin1 = 1,
        Pin2 = 2,
        Pin3 = 3,
        Pin4 = 4,
        Pin5 = 5,
        Pin6 = 6,
        Pin7 = 7,
        Pin8 = 8,
        Pin9 = 9,
        Pin10 = 10,
        Pin11 = 11,
        Pin12 = 12,
        Pin13 = 13,
        Pin14 = 14,
        Pin15 = 15,
    }

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

    export enum LEDNum {
        LED1 = 1,
        LED2 = 2,
        LED3 = 3,
        LED4 = 4,
        LED5 = 5,
        LED6 = 6,
        LED7 = 7,
        LED8 = 8,
        LED9 = 9,
        LED10 = 10,
        LED11 = 11,
        LED12 = 12,
        LED13 = 13,
        LED14 = 14,
        LED15 = 15,
        LED16 = 16,
    }

    export class ServoConfigObject {
        id: number;
        pinNumber: number;
        minOffset: number;
        midOffset: number;
        maxOffset: number;
        position: number;
    }

    export const DefaultServoConfig = new ServoConfigObject();
    DefaultServoConfig.pinNumber = -1
    DefaultServoConfig.minOffset = 5
    DefaultServoConfig.midOffset = 15
    DefaultServoConfig.maxOffset = 25
    DefaultServoConfig.position = 90

    export class ServoConfig {
        id: number;
        pinNumber: number;
        minOffset: number;
        midOffset: number;
        maxOffset: number;
        position: number;
        constructor(id: number, config: ServoConfigObject) {
            this.id = id
            this.init(config)
        }

        init(config: ServoConfigObject) {
            this.pinNumber = config.pinNumber > -1 ? config.pinNumber : this.id - 1
            this.setOffsetsFromFreq(config.minOffset, config.maxOffset, config.midOffset)
            this.position = -1
        }

        debug() {
            const params = this.config()

            for (let j = 0; j < params.length; j = j + 2) {
                debug(`Servo[${this.id}].${params[j]}: ${params[j + 1]}`)
            }
        }

        setOffsetsFromFreq(startFreq: number, stopFreq: number, midFreq: number = -1): void {
            this.minOffset = startFreq // calcFreqOffset(startFreq)
            this.maxOffset = stopFreq // calcFreqOffset(stopFreq)
            this.midOffset = midFreq > -1 ? midFreq : ((stopFreq - startFreq) / 2) + startFreq
        }

        config(): string[] {
            return [
                'id', this.id.toString(),
                'pinNumber', this.pinNumber.toString(),
                'minOffset', this.minOffset.toString(),
                'maxOffset', this.maxOffset.toString(),
                'position', this.position.toString(),
            ]
        }
    }

    export class ChipConfig {
        address: number;
        servos: ServoConfig[];
        freq: number;
        constructor(address: number = 0x40, freq: number = 50) {
            this.address = address
            this.servos = [
                new ServoConfig(1, DefaultServoConfig),
                new ServoConfig(2, DefaultServoConfig),
                new ServoConfig(3, DefaultServoConfig),
                new ServoConfig(4, DefaultServoConfig),
                new ServoConfig(5, DefaultServoConfig),
                new ServoConfig(6, DefaultServoConfig),
                new ServoConfig(7, DefaultServoConfig),
                new ServoConfig(8, DefaultServoConfig),
                new ServoConfig(9, DefaultServoConfig),
                new ServoConfig(10, DefaultServoConfig),
                new ServoConfig(11, DefaultServoConfig),
                new ServoConfig(12, DefaultServoConfig),
                new ServoConfig(13, DefaultServoConfig),
                new ServoConfig(14, DefaultServoConfig),
                new ServoConfig(15, DefaultServoConfig),
                new ServoConfig(16, DefaultServoConfig)
            ]
            this.freq = freq
            init(address, freq)
        }
    }

    export const chips: ChipConfig[] = []

    function calcFreqPrescaler(freq: number): number {
        return (25000000 / (freq * chipResolution)) - 1;
    }

    function stripHexPrefix(str: string): string {
        if (str.length === 2) {
            return str
        }
        if (str.substr(0, 2) === '0x') {
            return str.substr(-2, 2)
        }
        return str
    }

    function write(chipAddress: number, register: number, value: number): void {
        const buffer = pins.createBuffer(2)
        buffer[0] = register
        buffer[1] = value
        pins.i2cWriteBuffer(chipAddress, buffer, false)
    }

    export function getChipConfig(address: number): ChipConfig {
        for (let i = 0; i < chips.length; i++) {
            if (chips[i].address === address) {
                debug(`Returning chip ${i}`)
                return chips[i]
            }
        }
        debug(`Creating new chip for address ${address}`)
        const chip = new ChipConfig(address)
        const index = chips.length
        chips.push(chip)
        return chips[index]
    }

    function calcFreqOffset(freq: number, offset: number) {
        return ((offset * 1000) / (1000 / freq) * chipResolution) / 10000
    }

  
    export function setPinPulseRange(pinNumber: PinNum = 0, onStep: number = 0, offStep: number = 2048, chipAddress: number = 0x40): void {
        pinNumber = Math.max(0, Math.min(15, pinNumber))
        const buffer = pins.createBuffer(2)
        const pinOffset = PinRegDistance * pinNumber
        onStep = Math.max(0, Math.min(4095, onStep))
        offStep = Math.max(0, Math.min(4095, offStep))

        debug(`setPinPulseRange(${pinNumber}, ${onStep}, ${offStep}, ${chipAddress})`)
        debug(`  pinOffset ${pinOffset}`)

        // Low byte of onStep
        write(chipAddress, pinOffset + channel0OnStepLowByte, onStep & 0xFF)

        // High byte of onStep
        write(chipAddress, pinOffset + channel0OnStepHighByte, (onStep >> 8) & 0x0F)

        // Low byte of offStep
        write(chipAddress, pinOffset + channel0OffStepLowByte, offStep & 0xFF)

        // High byte of offStep
        write(chipAddress, pinOffset + channel0OffStepHighByte, (offStep >> 8) & 0x0F)
    }


    export function setLedDutyCycle(ledNum: LEDNum = 1, dutyCycle: number, chipAddress: number = 0x40): void {
        ledNum = Math.max(1, Math.min(16, ledNum))
        dutyCycle = Math.max(0, Math.min(100, dutyCycle))
        const pwm = (dutyCycle * (chipResolution - 1)) / 100
        debug(`setLedDutyCycle(${ledNum}, ${dutyCycle}, ${chipAddress})`)
        return setPinPulseRange(ledNum - 1, 0, pwm, chipAddress)
    }

    function degrees180ToPWM(freq: number, degrees: number, offsetStart: number, offsetEnd: number): number {
        // Calculate the offset of the off point in the freq
        offsetEnd = calcFreqOffset(freq, offsetEnd)
        offsetStart = calcFreqOffset(freq, offsetStart)
        const spread: number = offsetEnd - offsetStart
        const calcOffset: number = ((degrees * spread) / 180) + offsetStart
        // Clamp it to the bounds
        return Math.max(offsetStart, Math.min(offsetEnd, calcOffset))
    }

  /**
 * Nastaví polohové servo (0–180°) 
 * @param servo Servo, které chceme natočit; eg: Servo1
 * @param uhel Úhel natočení v rozsahu 0–180°; eg: 90
 */
//% group="Serva"
    //% block="nastav 180° $servo na úhel $uhel °"
//% uhel.min=0 uhel.max=180 uhel.defl=90
export function nastavPolohoveServo(servo: ServoNum = 1, uhel: number): void {
    const chipAddress = 0x40
    const chip = getChipConfig(chipAddress)
    servo = Math.max(1, Math.min(16, servo))
    uhel = Math.max(0, Math.min(180, uhel))

    const servoObj: ServoConfig = chip.servos[servo - 1]
    const pwm = degrees180ToPWM(chip.freq, uhel, servoObj.minOffset, servoObj.maxOffset)

    servoObj.position = uhel
    return setPinPulseRange(servoObj.pinNumber, 0, pwm, chipAddress)
}


/**
 * Nastaví kontinuální servo na danou rychlost (-100 až 100 %)
 * @param servo Servo, které chceme ovládat; eg: Servo1
 * @param speed Rychlost v %, záporná pro zpětný chod; eg: 50
 */

//% group="Serva"    
//% block="nastav 360° $servo na rychlost $speed %%"
//% speed.min=-100 speed.max=100 speed.defl=0
export function nastavKontinualniServo(servo: ServoNum = 1, speed: number): void {
    const chipAddress = 0x40
    const chip = getChipConfig(chipAddress)
    const freq = chip.freq
    servo = Math.max(1, Math.min(16, servo))
    const servoObj: ServoConfig = chip.servos[servo - 1]
    const offsetStart = calcFreqOffset(freq, servoObj.minOffset)
    const offsetMid = calcFreqOffset(freq, servoObj.midOffset)
    const offsetEnd = calcFreqOffset(freq, servoObj.maxOffset)

    if (speed === 0) {
        return setPinPulseRange(servoObj.pinNumber, 0, offsetMid, chipAddress)
    }

    const isReverse: boolean = speed < 0
    const spread = isReverse ? offsetMid - offsetStart : offsetEnd - offsetMid
    servoObj.position = speed
    speed = Math.abs(speed)
    const calcOffset: number = ((speed * spread) / 100)
    const pwm = isReverse ? offsetMid - calcOffset : offsetMid + calcOffset

    return setPinPulseRange(servoObj.pinNumber, 0, pwm, chipAddress)
}

  
    export function setServoLimits(servoNum: ServoNum = 1, minTimeCs: number = 5, maxTimeCs: number = 2.5, midTimeCs: number = -1, chipAddress: number = 0x40): void {
        const chip = getChipConfig(chipAddress)
        servoNum = Math.max(1, Math.min(16, servoNum))
        minTimeCs = Math.max(0, minTimeCs)
        maxTimeCs = Math.max(0, maxTimeCs)
        debug(`setServoLimits(${servoNum}, ${minTimeCs}, ${maxTimeCs}, ${chipAddress})`)
        const servo: ServoConfig = chip.servos[servoNum - 1]
        midTimeCs = midTimeCs > -1 ? midTimeCs : ((maxTimeCs - minTimeCs) / 2) + minTimeCs
        debug(`midTimeCs ${midTimeCs}`)
        return servo.setOffsetsFromFreq(minTimeCs, maxTimeCs, midTimeCs)
    }

  
    export function init(chipAddress: number = 0x40, newFreq: number = 50) {
        debug(`Init chip at address ${chipAddress} to ${newFreq}Hz`)
        const buf = pins.createBuffer(2)
        const freq = (newFreq > 1000 ? 1000 : (newFreq < 40 ? 40 : newFreq))
        const prescaler = calcFreqPrescaler(freq)

        write(chipAddress, modeRegister1, sleep)

        write(chipAddress, PrescaleReg, prescaler)

        write(chipAddress, allChannelsOnStepLowByte, 0x00)
        write(chipAddress, allChannelsOnStepHighByte, 0x00)
        write(chipAddress, allChannelsOffStepLowByte, 0x00)
        write(chipAddress, allChannelsOffStepHighByte, 0x00)

        write(chipAddress, modeRegister1, wake)

        control.waitMicros(1000)
        write(chipAddress, modeRegister1, restart)
    }

  /**
 * Provede úplný reset čipu PCA9685 a vypne všechny výstupy pro serva
 */
//% group="Serva"
    //% block="resetuj čip pro serva"
export function reset(): void {
    const chipAddress = 0x40
    return init(chipAddress, getChipConfig(chipAddress).freq);
}


    export function chipAddress(hexAddress: string): number {
        hexAddress = stripHexPrefix(hexAddress)
        let dec = 0
        let lastidx = 0
        let lastchar = 0
        const l = Math.min(2, hexAddress.length)
        for (let i = 0; i < l; i++) {
            const char = hexAddress.charAt(i)
            const idx = hexChars.indexOf(char)
            const pos = l - i - 1
            lastidx = pos
            dec = dec + (idx * Math.pow(16, pos))
        }
        return dec
    }

    export function setDebug(debugEnabled: boolean): void {
        _DEBUG = debugEnabled
    }






    export enum Motor {
        Motor1 = 1,
        Motor2 = 2
    }

    export enum Smer {
        Dopredu = 0,
        Dozadu = 1
    }

    /**
     * Otáčí motorem požadovaným směrem a rychlostí (0–100 %)
     * @param motor Motor, který chceme ovládat; eg: Motor.Motor1
     * @param smer Směr otáčení; eg: Smer.Dopredu
     * @param rychlost Rychlost 0–100 %; eg: 50
     */
//% group="Motory"    
//% block="motor $motor otáčej $smer rychlostí $rychlost %"
    //% rychlost.min=0 rychlost.max=100 rychlost.defl=50
    export function otacejMotor(motor: Motor, smer: Smer, rychlost: number): void {
        rychlost = Math.max(0, Math.min(100, rychlost))
        const analog = Math.map(rychlost, 0, 100, 0, 1023)

        if (motor == Motor.Motor1) {
            pins.digitalWritePin(DigitalPin.P13, smer == Smer.Dopredu ? 0 : 1)
            pins.analogWritePin(AnalogPin.P14, analog)
        } else {
            pins.digitalWritePin(DigitalPin.P15, smer == Smer.Dopredu ? 0 : 1)
            pins.analogWritePin(AnalogPin.P16, analog)
        }
    }

    /**
     * Otáčí motorem daným směrem a rychlostí po zadanou dobu (v sekundách)
     * @param motor Motor, který chceme ovládat; eg: Motor.Motor1
     * @param smer Směr otáčení; eg: Smer.Dopredu
     * @param rychlost Rychlost 0–100 %; eg: 75
     * @param sekundy Počet sekund; eg: 2
     */
//% group="Motory"    
//% block="motor $motor otáčej $smer rychlostí $rychlost % po dobu $sekundy sekundy"
    //% rychlost.min=0 rychlost.max=100 rychlost.defl=75
    //% sekundy.min=0 sekundy.defl=2
    export function otacejMotorCasove(motor: Motor, smer: Smer, rychlost: number, sekundy: number): void {
        otacejMotor(motor, smer, rychlost)
        basic.pause(sekundy * 1000)
        otacejMotor(motor, smer, 0)
    }




  export enum Jednotka {
    //% block="centimetry"
    cm,
    //% block="milimetry"
    mm,
    //% block="mikrosekundy"
    us
}

let trigPin: DigitalPin = DigitalPin.P1
let echoPin: DigitalPin = DigitalPin.P2
let jednotka: Jednotka = Jednotka.cm

    /**
     * Nastaví sonar (trig, echo a jednotku měření)
     * @param trig výstupní pin
     * @param echo vstupní pin
     * @param jednotka jednotka výsledku; eg: Jednotka.cm
     */
    //% group="Sonar"
    //% block="nastav sonar trig %trig echo %echo jednotka %jednotka"
    export function nastavSonar(trig: DigitalPin, echo: DigitalPin, jednotkaNova: Jednotka): void {
        trigPin = trig
        echoPin = echo
        jednotka = jednotkaNova
    }

    /**
     * Získá aktuální vzdálenost ze sonaru v nastavené jednotce
     */
    //% group="Sonar"
    //% block="vzdálenost"
    export function vzdalenost(): number {
        pins.setPull(echoPin, PinPullMode.PullNone)
        pins.digitalWritePin(trigPin, 0)
        control.waitMicros(2)
        pins.digitalWritePin(trigPin, 1)
        control.waitMicros(10)
        pins.digitalWritePin(trigPin, 0)

        const d = pins.pulseIn(echoPin, PulseValue.High, 25000) // max. 25 ms = ~4 m

        if (d == 0) return 0

        switch (jednotka) {
            case Jednotka.cm: return Math.idiv(d, 58)
            case Jednotka.mm: return Math.idiv(d * 10, 58)
            case Jednotka.us: return d
            default: return -1
        }
    }




    const TCS34725_ADDRESS = 0x29
    const TCS34725_COMMAND_BIT = 0x80
    const TCS34725_ENABLE = 0x00
    const TCS34725_ENABLE_PON = 0x01
    const TCS34725_ENABLE_AEN = 0x02
    const TCS34725_ATIME = 0x01
    const TCS34725_CONTROL = 0x0F
    const TCS34725_ID = 0x12
    const TCS34725_CDATAL = 0x14

    let tcsInitialized = false
    let red = 0
    let green = 0
    let blue = 0
    let clear = 0
    let posledniBarva = ""

    function i2cWriteTCS(reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = TCS34725_COMMAND_BIT | reg
        buf[1] = value
        pins.i2cWriteBuffer(TCS34725_ADDRESS, buf, false)
    }

    function i2cReadTCS(reg: number): number {
        pins.i2cWriteNumber(TCS34725_ADDRESS, TCS34725_COMMAND_BIT | reg, NumberFormat.UInt8BE, false)
        return pins.i2cReadNumber(TCS34725_ADDRESS, NumberFormat.UInt8LE, false)
    }

    function i2cRead16TCS(reg: number): number {
        pins.i2cWriteNumber(TCS34725_ADDRESS, TCS34725_COMMAND_BIT | reg, NumberFormat.UInt8BE, false)
        return pins.i2cReadNumber(TCS34725_ADDRESS, NumberFormat.UInt16LE, false)
    }

    
    /**
     * Inicializuje senzor barev TCS34725
     */
    //% group="RGB senzor"
    //% block="inicializuj senzor barev"
    export function initTCS34725(): void {
        const id = i2cReadTCS(TCS34725_ID)
        if (id != 0x44) return

        i2cWriteTCS(TCS34725_ENABLE, TCS34725_ENABLE_PON)
        basic.pause(3)
        i2cWriteTCS(TCS34725_ENABLE, TCS34725_ENABLE_PON | TCS34725_ENABLE_AEN)
        i2cWriteTCS(TCS34725_ATIME, 0xFF) // integrační čas
        i2cWriteTCS(TCS34725_CONTROL, 0x00) // zesílení

        tcsInitialized = true
    }

    /**
     * Načte hodnoty RGB z čidla
     */
    //% group="RGB senzor"
    //% block="načti barvu"
    export function nactiBarvu(): void {
        if (!tcsInitialized) initTCS34725()

        clear = i2cRead16TCS(TCS34725_CDATAL)
        red = i2cRead16TCS(TCS34725_CDATAL + 2)
        green = i2cRead16TCS(TCS34725_CDATAL + 4)
        blue = i2cRead16TCS(TCS34725_CDATAL + 6)
        posledniBarva = rozpoznanaBarva()
    }

    /**
     * Vrátí hodnotu červené složky (0–65535)
     */
    //% group="RGB senzor"
    //% block="hodnota červené"
    export function hodnotaCervene(): number {
        return red
    }

    /**
     * Vrátí hodnotu zelené složky (0–65535)
     */
    //% group="RGB senzor"
    //% block="hodnota zelené"
    export function hodnotaZelene(): number {
        return green
    }

    /**
     * Vrátí hodnotu modré složky (0–65535)
     */
    //% group="RGB senzor"
    //% block="hodnota modré"
    export function hodnotaModre(): number {
        return blue
    }

    /**
     * Vrátí intenzitu světla (clear kanál)
     */
    //% group="RGB senzor"
    //% block="intenzita světla"
    export function intenzitaSvetla(): number {
        return clear
    }

    /**
     * Vrátí název barvy na základě RGB hodnot
     */
    //% group="RGB senzor"
    //% block="rozpoznaná barva"
    export function rozpoznanaBarva(): string {
        const r = red
        const g = green
        const b = blue

        if (r > 220 && g < 100 && b < 100) return "červená"
        if (r < 100 && g > 220 && b < 100) return "zelená"
        if (r < 100 && g < 100 && b > 220) return "modrá"
        if (r > 200 && g > 200 && b < 100) return "žlutá"
        if (r > 200 && g < 100 && b > 200) return "fialová"
        if (r < 100 && g > 200 && b > 200) return "tyrkysová"
        if (r > 180 && g > 180 && b > 180) return "bílá"
        if (r < 50 && g < 50 && b < 50) return "černá"
        if (r > 160 && g > 100 && b < 100) return "oranžová"
        if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && r > 80 && r < 180) return "šedá"
        if (r > g && g > b && r > 100 && g > 70 && b < 50) return "hnědá"
        return "černá"
    }
export enum BarvaRozpoznana {
    //% block="červená"
    Cervena,
    //% block="zelená"
    Zelena,
    //% block="modrá"
    Modra,
    //% block="žlutá"
    Zluta,
    //% block="fialová"
    Fialova,
    //% block="tyrkysová"
    Tyrkysova,
    //% block="bílá"
    Bila,
    //% block="černá"
    Cerna,
    //% block="oranžová"
    Oranzova,
    //% block="šedá"
    Seda,
    //% block="hnědá"
    Hneda
}

    
  /**
 * Podmínkový blok: pokud rozpoznaná barva je (z výběru)
 */
//% group="RGB senzor"
//% block="rozpoznaná barva je %barva"
export function jeBarva(barva: BarvaRozpoznana): boolean {
    const mapovani = [
        "červená", "zelená", "modrá", "žlutá", "fialová", "tyrkysová",
        "bílá", "černá", "oranžová", "šedá", "hnědá"
    ]
    return posledniBarva == mapovani[barva]
}

    

    
}
