export namespace createRideDto {
    export class Input {
        userId!: number;
        route!: [number, number][];
        startTime!: Date;
        maxPassengers!: number;
        startLocation!: [number, number];
        endLocation!: [number, number];
        perPassengerFare?: number;
    }
}