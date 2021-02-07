export namespace createRideDto {
    export class Input {
        userId!: number;
        route!: [number, number][];
        startTime!: Date;
        maxPassengers!: number;
        startLocation!: [number, number];
        endLocation!: [number, number];
        perPassengerFare?: number;
        startLocationName?: string;
        endLocationName?: string
        estimatedDuration?: string;
        distance?: string;
    }
}