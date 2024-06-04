import { Injectable } from '@angular/core';
import { Material } from '../Interfaces/material';
import { MaterialsService } from './materials.service';
import { UmfInterface } from '../Interfaces/umfInterface';

@Injectable({
  providedIn: 'root'
})

export class ChemistryCalculatorService {

  constructor(private materialsService: MaterialsService) { }

  getMaterialsFromNames(materials: Material[]): Material[] {
    return materials.map(material => this.materialsService.getMaterial(material.Name));
  }

  calculateTotalOxides(materials: Material[]): Map<string, number> {
    const oxideTotals = new Map<string, number>();

    materials.forEach(material => {
      if (material === undefined) return;
      material.Oxides.forEach(oxide => {
        const oxideWeight = oxide.Analysis / 100 * material.OxidesWeight; // Calculate absolute oxide weight
        oxideTotals.set(oxide.OxideName, (oxideTotals.get(oxide.OxideName) || 0) + oxideWeight);
      });
    });

    return oxideTotals;
  }

  normalizeFluxes(oxideTotals: Map<string, number>): Map<string, number> {
    const fluxes = ['Na2O', 'K2O', 'CaO', 'MgO', 'BaO', 'Li2O', 'ZnO', 'PbO']; // Add other flux oxides as per your formula
    let totalFluxWeight = 0;

    // Calculate total weight of flux oxides
    fluxes.forEach(flux => {
      totalFluxWeight += oxideTotals.get(flux) || 0;
    });

    // Normalize each flux oxide
    const normalizedFluxes = new Map<string, number>();
    fluxes.forEach(flux => {
      const normalizedWeight = (oxideTotals.get(flux) || 0) / totalFluxWeight;
      normalizedFluxes.set(flux, normalizedWeight);
    });

    return normalizedFluxes;
  }

  calculateUMF(normalizedFluxes: Map<string, number>, oxideTotals: Map<string, number>): Map<string, number> {
    // Scale non-flux oxides based on normalized flux total
    let totalFlux = 0;

    normalizedFluxes.forEach(value => { totalFlux += value; });

    const finalOxideRatios = new Map<string, number>();
    
    oxideTotals.forEach((weight, oxide) => {
      if (!normalizedFluxes.has(oxide)) { // Skip already normalized fluxes
        const mole = weight / this.molecularWeights[oxide];
        const scaledMole = mole / totalFlux;
        finalOxideRatios.set(oxide, scaledMole);
      }
    });

    // Add normalized fluxes as mole values
    normalizedFluxes.forEach((value, flux) => {
      finalOxideRatios.set(flux, value / this.molecularWeights[flux] / totalFlux);
    });

    return finalOxideRatios;
  }

  molecularWeights: { [key: string]: number } = {
    'Li2O': 29.88,    // Lithium Oxide
    'Na2O': 61.98,    // Sodium Oxide
    'K2O': 94.2,      // Potassium Oxide
    'BeO': 25.01,     // Beryllium Oxide
    'MgO': 40.3,      // Magnesium Oxide
    'CaO': 56.08,     // Calcium Oxide
    'SrO': 103.62,    // Strontium Oxide
    'BaO': 153.33,    // Barium Oxide
    'RaO': 225.2,     // Radium Oxide
    'B2O3': 69.62,    // Boron Oxide
    'Al2O3': 101.96,  // Aluminum Oxide
    'Ga2O3': 187.44,  // Gallium Oxide
    'In2O3': 277.64,  // Indium Oxide
    'TiO2': 79.87,    // Titanium Dioxide
    'ZrO2': 123.22,   // Zirconium Dioxide
    'SnO2': 150.71,   // Tin Dioxide
    'PbO': 223.2,     // Lead(II) Oxide
    'Pb3O4': 685.6,   // Lead(II,IV) Oxide
    'PbO2': 239.2,    // Lead(IV) Oxide
    'FeO': 71.84,     // Iron(II) Oxide
    'Fe2O3': 159.69,  // Iron(III) Oxide
    'Fe3O4': 231.53,  // Iron(II,III) Oxide
    'CoO': 74.93,     // Cobalt(II) Oxide
    'NiO': 74.71,     // Nickel(II) Oxide
    'CuO': 79.55,     // Copper(II) Oxide
    'ZnO': 81.38,     // Zinc Oxide
    'Y2O3': 225.81,   // Yttrium Oxide
    'Nb2O5': 265.81,  // Niobium(V) Oxide
    'MoO3': 143.94,   // Molybdenum(VI) Oxide
    'RuO2': 133.07,   // Ruthenium(IV) Oxide
    'Rh2O3': 253.88,  // Rhodium(III) Oxide
    'PdO': 106.42,    // Palladium(II) Oxide
    'Ag2O': 231.74,   // Silver(I) Oxide
    'CdO': 128.41,    // Cadmium Oxide
    'SnO': 134.71,    // Tin(II) Oxide
    'HfO2': 210.49,   // Hafnium Dioxide
    'WO3': 231.84,    // Tungsten(VI) Oxide
    'ReO3': 234.20,   // Rhenium(III) Oxide
    'OsO4': 254.23,   // Osmium(IV) Oxide
    'IrO2': 224.22,   // Iridium(IV) Oxide
    'PtO2': 227.08,   // Platinum(IV) Oxide
    'Au2O3': 441.93,  // Gold(III) Oxide
    'HgO': 216.59,    // Mercury(II) Oxide
    'ThO2': 264.04,   // Thorium Dioxide
    'UO2': 270.03,    // Uranium Dioxide
    'U3O8': 842.08,   // Uranium Oxide
    'SiO2': 60.08,    // Silicon Dioxide
    'GeO2': 104.64,   // Germanium Dioxide
    'As2O3': 197.84,  // Arsenic(III) Oxide
    'SeO2': 110.96,   // Selenium Dioxide
    'TeO2': 159.60,   // Tellurium Dioxide
    'Bi2O3': 465.96   // Bismuth(III) Oxide
  };
}
