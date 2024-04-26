import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IngredientTypesService {

  silicaSources: string[] = [
    "Quartz",
    "Flint",
    "Silica Sand",
    "Feldspar (e.g., nepheline syenite)",
    "Ball Clay",
    "Kaolin",
    "Talc",
    "Bone Ash",
    "Alumina Hydrate",
    "Rice Husk Ash",
    "Diatomaceous Earth",
    "Volcanic Ash (e.g., pumice)",
    "Silica Gel",
    "Colloidal Silica",
    "Silica Fume (microsilica)",
    "Rice Ash Glaze",
    "Glass Powder (cullet)"
  ];

  fluxMaterials: string[] = [
    "Potash Feldspar",
    "Soda Feldspar",
    "Calcium Carbonate (Whiting)",
    "Dolomite",
    "Gerstley Borate",
    "Lithium Carbonate",
    "Bone Ash",
    "Talc",
    "Borax",
    "Nepheline Syenite",
    "Wollastonite",
    "Strontium Carbonate",
    "Barium Carbonate",
    "Flux Frits",
    "Fritted Borax",
    "Fritted Lead",
    "Fritted Zinc",
    "Fritted Alumina",
    "Fritted Boron",
    "Fritted Lithium",
    "Cadmium Oxide",
    "Zinc Oxide **",
    "Lead Oxide **",
    "Potassium Nitrate **",
    "Sodium Nitrate **",
    "Strontium Carbonate **",
    "Barium Carbonate **",
    "Flux Frits (various compositions) **",
    "Lithium Carbonate **",
    "Lithium Nitrate **",
    "Lithium Borate **",
    "Vanadium Pentoxide **",
    "Selenium Dioxide **",
    "Manganese Dioxide **",
    "Iron Oxide (in reduction firings) **",
    "Copper Oxide (in reduction firings) **"
  ];

  stabilizers: string[] = [
    "Alumina",
    "Zirconium Oxide",
    "Magnesium Carbonate",
    "Strontium Carbonate",
    "Barium Carbonate",
    "Lithium Carbonate",
    "Boron Oxide",
    "Calcium Carbonate",
    "Sodium Carbonate",
    "Potassium Carbonate",
    "Lead Oxide",
    "Titanium Dioxide",
    "Manganese Dioxide",
    "Iron Oxide",
    "Copper Oxide",
    "Cobalt Oxide",
    "Nickel Oxide",
    "Chromium Oxide",
    "Tin Oxide",
    "Vanadium Pentoxide",
    "Cadmium Oxide",
    "Selenium Dioxide"
  ];

  colorants: string[] = [
    "Iron Oxide (Red, Yellow, Brown)",
    "Copper Oxide (Green, Blue, Red)",
    "Cobalt Oxide (Blue)",
    "Chrome Oxide (Green)",
    "Manganese Dioxide (Brown, Purple)",
    "Nickel Oxide (Green)",
    "Titanium Dioxide (White)",
    "Rutile (Yellow, Tan)",
    "Vanadium Pentoxide (Yellow, Green)",
    "Cadmium Oxide (Yellow, Red)",
    "Stains (Various Colors)",
    "Zirconium Silicate (White, Opacifier)",
    "Tin Oxide (White, Opacifier)",
    "Antimony Oxide (Opacifier)",
    "Zinc Oxide (Opacifier, Flux)"
  ];

  constructor() { }
}
