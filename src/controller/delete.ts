import { VehicleStore } from '../store/vehicle';
import { Request, Response } from 'express';

interface Parameters {
  id: string;
}

export class DeleteVehicleController {
  constructor(private readonly vehicleStore: VehicleStore) {
    this.vehicleStore = vehicleStore
  }
  
  public async handle(req: Request<Parameters>, res: Response): Promise<void> {
  const idString: string = req.params.id;
  const idNumber= {id: parseInt(idString)};
  await this.vehicleStore.deleteVehicle(idNumber);
    res.status(204).send("Ca DELETE");
  }
}


