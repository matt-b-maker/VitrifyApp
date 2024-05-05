import { Injectable } from '@angular/core';
import { Ingredient } from '../Models/ingredientModel';

@Injectable({
  providedIn: 'root'
})

export class IngredientTypesService {

  silicaMaterials: string[] = [
    "Silica",
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

  stabilizerMaterials: string[] = [
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

  colorantMaterials: string[] = [
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

  allMaterials: Ingredient[] = [
    // Silica Materials
    new Ingredient("Silica", {composition: "SiO₂", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Quartz", {composition: "SiO₂", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Flint", {composition: "SiO₂", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Silica Sand", {composition: "SiO₂", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Feldspar (e.g., nepheline syenite)", {composition: "K₂O.Al₂O₃.6SiO₂", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Ball Clay", {composition: "Al₂O₃.2SiO₂.2H₂O", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Kaolin", {composition: "Al₂O₃.2SiO₂.2H₂O", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Talc", {composition: "Mg₃Si₄O₁₀(OH)₂", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Bone Ash", {composition: "Ca₃(PO₄)₂", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Alumina Hydrate", {composition: "Al₂O₃.3H₂O", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Rice Husk Ash", {composition: "SiO₂", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Diatomaceous Earth", {composition: "SiO₂", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Volcanic Ash (e.g., pumice)", {composition: "SiO₂", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Silica Gel", {composition: "SiO₂", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Colloidal Silica", {composition: "SiO₂", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Silica Fume (microsilica)", {composition: "SiO₂", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Rice Ash Glaze", {composition: "SiO₂", colorClass: "blue colorClass"}, "silica", 0, 1),
    new Ingredient("Glass Powder (cullet)", {composition: "SiO₂", colorClass: "blue colorClass"}, "silica", 0, 1),

    // Flux Materials
    new Ingredient("Potash Feldspar", {composition: "K₂O.Al₂O₃.6SiO₂", colorClass: "dark green colorClass"}, "flux", 0, 1),
    new Ingredient("Soda Feldspar", {composition: "Na₂O.Al₂O₃.6SiO₂", colorClass: "dark green colorClass"}, "flux", 0, 1),
    new Ingredient("Calcium Carbonate (Whiting)", {composition: "CaCO₃", colorClass: "dark green colorClass"}, "flux", 0, 1),
    new Ingredient("Dolomite", {composition: "CaMg(CO₃)₂", colorClass: "dark green colorClass"}, "flux", 0, 1),
    new Ingredient("Gerstley Borate", {composition: "2MgO.2B₂O₃.5SiO₂", colorClass: "dark green colorClass"}, "flux", 0, 1),
    new Ingredient("Lithium Carbonate", {composition: "Li₂CO₃", colorClass: "dark green colorClass"}, "flux", 0, 1),
    new Ingredient("Borax", {composition: "Na₂B₄O₇.10H₂O", colorClass: "dark green colorClass"}, "flux", 0, 1),
    new Ingredient("Nepheline Syenite", {composition: "K₂O.3Na₂O.4Al₂O₃.6SiO₂", colorClass: "dark green colorClass"}, "flux", 0, 1),
    new Ingredient("Wollastonite", {composition: "CaSiO₃", colorClass: "dark green colorClass"}, "flux", 0, 1),
    new Ingredient("Strontium Carbonate", {composition: "SrCO₃", colorClass: "dark green colorClass"}, "flux", 0, 1),
    new Ingredient("Barium Carbonate", {composition: "BaCO₃", colorClass: "dark green colorClass"}, "flux", 0, 1),
    new Ingredient("Flux Frits", {composition: "various compositions", colorClass: "dark green colorClass"}, "flux", 0, 1),
    // Add more flux materials

    // Stabilizer Materials
    new Ingredient("Alumina", {composition: "Al₂O₃", colorClass: "light blue colorClass"}, "stabilizer", 0, 1),
    new Ingredient("Zirconium Oxide", {composition: "ZrO₂", colorClass: "light blue colorClass"}, "stabilizer", 0, 1),
    new Ingredient("Magnesium Carbonate", {composition: "MgCO₃", colorClass: "light blue colorClass"}, "stabilizer", 0, 1),
    new Ingredient("Strontium Carbonate", {composition: "SrCO₃", colorClass: "light blue colorClass"}, "stabilizer", 0, 1),
    new Ingredient("Barium Carbonate", {composition: "BaCO₃", colorClass: "light blue colorClass"}, "stabilizer", 0, 1),
    new Ingredient("Lithium Carbonate", {composition: "Li₂CO₃", colorClass: "light blue colorClass"}, "stabilizer", 0, 1),
    new Ingredient("Boron Oxide", {composition: "B₂O₃", colorClass: "light blue colorClass"}, "stabilizer", 0, 1),
    new Ingredient("Calcium Carbonate", {composition: "CaCO₃", colorClass: "light blue colorClass"}, "stabilizer", 0, 1),
    new Ingredient("Sodium Carbonate", {composition: "Na₂CO₃", colorClass: "light blue colorClass"}, "stabilizer", 0, 1),
    new Ingredient("Potassium Carbonate", {composition: "K₂CO₃", colorClass: "light blue colorClass"}, "stabilizer", 0, 1),
    // Add more stabilizer materials

    // Colorant Materials
    new Ingredient("Iron Oxide (Red)", {composition: "Fe₂O₃", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Iron Oxide (Yellow)", {composition: "Fe₂O₃", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Iron Oxide (Brown)", {composition: "Fe₂O₃", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Copper Oxide (Green)", {composition: "CuO", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Copper Oxide (Blue)", {composition: "CuO", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Copper Oxide (Red)", {composition: "CuO", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Cobalt Oxide (Blue)", {composition: "CoO", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Chrome Oxide (Green)", {composition: "Cr₂O₃", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Manganese Dioxide (Brown)", {composition: "MnO₂", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Manganese Dioxide (Purple)", {composition: "MnO₂", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Nickel Oxide (Green)", {composition: "NiO", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Titanium Dioxide (White)", {composition: "TiO₂", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Rutile (Yellow)", {composition: "TiO₂", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Vanadium Pentoxide (Yellow)", {composition: "V₂O₅", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Vanadium Pentoxide (Green)", {composition: "V₂O₅", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Cadmium Oxide (Yellow)", {composition: "CdO", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Cadmium Oxide (Red)", {composition: "CdO", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Zirconium Silicate (White)", {composition: "ZrSiO₄", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Tin Oxide (White)", {composition: "SnO₂", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Antimony Oxide (Opacifier)", {composition: "Sb₂O₃", colorClass: "light red colorClass"}, "colorant", 0, 1),
    new Ingredient("Zinc Oxide (Opacifier, Flux)", {composition: "ZnO", colorClass: "light red colorClass"}, "colorant", 0, 1),
    // Add more colorant materials
  ];

  constructor() { }
}
