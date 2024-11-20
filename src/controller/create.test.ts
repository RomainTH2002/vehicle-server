/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-misused-promises, @typescript-eslint/no-explicit-any */
import {expect, jest, test} from '@jest/globals';
import { Pool } from 'pg';
import { Request, Response } from 'express';
import { FakeResponse } from "../fake/response";
import { CreateVehicleController } from "./create";
import { Vehicle } from "../model/vehicle";
import { VehicleStore } from "../store/vehicle";
//import { AppError, ErrorCode } from "../errors";

// On définit ici un module `Mock` ie: tout chargement du module `import { VehicleStore } from "../store/vehicle'`
// retournera une """fausse""" implémentation qui  n'intéragit pas avec la base de données.
jest.mock('../store/vehicle', (() => ({
  VehicleStore: jest.fn().mockImplementation(() => {
    return {
      createVehicle: jest.fn().mockImplementation(async (req: any): Promise<Vehicle> => {
        return new Vehicle(
          12,
          req.shortcode,
          req.battery,
          req.position,
        );
      }),
    }
  })
})));


// Describe décrit un groupe logique de tests, ayant la même logique de mise en place et de nettoyage.
describe('create vehicle controller', () => {
    let controller: CreateVehicleController;
    let store: VehicleStore;
  
    // Avant chaque test on réinitialise le store et le controller.
    beforeEach(() => {
      store =  new VehicleStore({} as Pool); // <- instance mockée!
      controller = new CreateVehicleController(store);
    });
  
    test('creates a valid vehicle', async () => {
      // Given.
      const req = {
        body: {
          shortcode: 'abac',
          battery: 17,
          longitude: 45,
          latitude: 45
        },
      };
  
      const resp = new FakeResponse();
  
      // When.
      await controller.handle(req as Request, resp as unknown as Response);
  
      // Then.
      expect(resp.gotStatus).toEqual(200);

      expect(resp.gotJson).toEqual({
        vehicle: new Vehicle(
            12,
            'abac',
            17,
            {longitude: 45, latitude: 45},
        )
    });
    });
  });