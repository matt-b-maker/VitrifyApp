import { Injectable } from '@angular/core';
import { Material } from '../Interfaces/material';
import { MaterialsService } from './materials.service';
import { UmfInterface } from '../Interfaces/umfInterface';

@Injectable({
  providedIn: 'root'
})

export class ChemistryCalculatorService {

  constructor() { }

  calculateUMF(materials: Material[]): UmfInterface {
    const totalWeights: { [key: string]: number } = {};
    let totalWeightSum = 0;
    // Sum the weights of each oxide from all materials
    materials.forEach(material => {
      material.Oxides.forEach(oxide => {
        if (!totalWeights[oxide.OxideName]) {
          totalWeights[oxide.OxideName] = 0;
        }
        totalWeights[oxide.OxideName] += (oxide.Analysis * material.Quantity) / material.OxidesWeight;
      });
      totalWeightSum += material.Quantity;
    });

    // Normalize the weights to get the UMF
    let umf: UmfInterface = {
      fluxes: {
        R2O: {
          K2O: totalWeights['K2O'] || 0,
          Na2O: totalWeights['Na2O'] || 0
        },
        RO: {
          CaO: totalWeights['CaO'] || 0,
          MgO: totalWeights['MgO'] || 0
        }
      },
      stabilizers: {
        R2O3: {
          Al2O3: totalWeights['Al2O3'] || 0,
          Fe2O3: totalWeights['Fe2O3'] || 0
        },
        B2O3: totalWeights['B2O3'] || 0
      },
      silicas: {
        SiO2: totalWeights['SiO2'] || 0,
        TiO2: totalWeights['TiO2'] || 0
      },
      other: {
        LOI: totalWeights['LOI'] || 0,
        P2O5: totalWeights['P2O5'] || 0,
        MnO: totalWeights['MnO'] || 0,
        Cl: totalWeights['Cl'] || 0
      }
    };

    // Normalize UMF so that the sum of the fluxes (R2O and RO) equals 1
    const fluxSum = umf.fluxes.R2O.K2O + umf.fluxes.R2O.Na2O + umf.fluxes.RO.CaO + umf.fluxes.RO.MgO;
    if (fluxSum > 0) {
      umf.fluxes.R2O.K2O /= fluxSum;
      umf.fluxes.R2O.Na2O /= fluxSum;
      umf.fluxes.RO.CaO /= fluxSum;
      umf.fluxes.RO.MgO /= fluxSum;
    }

    return umf;
  }
}
