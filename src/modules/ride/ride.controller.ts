import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { createRideDto } from './dtos/createRide.dto';
import { getRideSuggestions } from './dtos/getRideSuggestions.dto';
import { RideStatus } from './ride.entity';
import { RideService } from './ride.service';
import { RideUserStatus } from './rideUser.entity';

@Controller('ride')
export class RideController {
    constructor(private rideService: RideService) {

    }

    @Post('')
    async createUser(@Body() input: createRideDto.Input) {
      const ride = await this.rideService.createRide(input);
      return ride;
    }

    @Get('')
    async getRides() {
        return this.rideService.getAllRides();
    }

    @Get('/:rideId')
    async getRideDetails(@Param('rideId') rideId: number) {
        return this.rideService.getRideDetails(rideId);
    }

    @Get('/user/:userId')
    async getRidesByUserId(@Param('userId') userId: number, @Query('status') status: RideUserStatus, @Query('driver') isDriver: boolean) {
        return this.rideService.getRidesByUserId(userId, status, isDriver);
    }

    @Post('/suggestions')
    async getRideSuggestions(@Body() input: getRideSuggestions.Input) {
        return this.rideService.getRidesWithinDistance(input.startLocation, input.endLocation);
    }

    @Put('/:rideId/:userId/status')
    async updateRideUserStatus(@Param('rideId') rideId: number, @Param('userId') userId: number, @Body('status') status: RideUserStatus) {
        return this.rideService.updateRideUserStatus(rideId, userId, status);
    }

    @Put('/:rideId/:userId/location')
    async updateUserLocation(@Param('rideId') rideId: number, @Param('userId') userId: number, @Body('location') location: [number, number]) {
        return this.rideService.updateRideUserLocation(rideId, userId, location);
    }

    @Put('/:rideId/status')
    async startRide(@Param('rideId') rideId: number, @Body('status') status: RideStatus) {
        return this.rideService.updateRideStatus(rideId, status);
    }

}
