import { Injectable } from '@angular/core';

interface MolesOfEachElement {
  Aluminum?: number;
  Hydrogen?: number;
  Oxygen?: number;
  Silicon?: number;
  Potassium?: number;
}

interface Material {
  "Chemical Composition": string;
  "Moles of Each Element": any;
  "Physical Properties": string;
  "Uses in Glazes": string;
  "Other Applications": string;
  "Considerations": string;
  "Health and Safety": string;
  "Potential Substitutions": string;
  "Toxic": boolean;
}

interface MaterialsJson {
  [key: string]: Material;
}


@Injectable({
  providedIn: 'root'
})

export class MaterialsService {

  materialsArray: object[] = [];

  getMaterialsProperties(): any[] {
    return Object.keys(this.materialsJson).map(material => {
      const materialProperties = this.materialsJson[material];
      return {
        name: material,
        chemicalComposition: materialProperties['Chemical Composition'],
        molesOfEachElement: materialProperties['Moles of Each Element'],
        physicalProperties: materialProperties['Physical Properties'],
        usesInGlazes: materialProperties['Uses in Glazes'],
        otherApplications: materialProperties['Other Applications'],
        considerations: materialProperties['Considerations'],
        healthAndSafety: materialProperties['Health and Safety'],
        potentialSubstitutions: materialProperties['Potential Substitutions'],
        toxic: materialProperties['Toxic']
      };
    });
  }

  constructor() {
  }

  materialsJson: MaterialsJson = {
    "Alumina Hydrate": {
      "Chemical Composition": "Al(OH)₃",
      "Moles of Each Element": {
        "Aluminum": 1,
        "Hydrogen": 3,
        "Oxygen": 3
      },
      "Physical Properties": "White, powdery substance, slightly soluble in water.",
      "Uses in Glazes": "Used as a matting agent, stabilizer, and to contribute to opacity.",
      "Other Applications": "Acts as a hardening agent in low-fire glazes, enhances chemical resistance.",
      "Considerations": "Care needed with application amount and firing temperature.",
      "Health and Safety": "Generally considered safe for ceramic applications.",
      "Potential Substitutions": "Alumina Oxide can be used where higher temperature stability is needed.",
      "Toxic": false
    },
    "Alumina Oxide": {
      "Chemical Composition": "Al₂O₃",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Oxygen": 3
      },
      "Physical Properties": "White crystalline powder, insoluble in water.",
      "Uses in Glazes": "Increases hardness, chemical resistance, and glaze opacity.",
      "Other Applications": "Used in refractories and as a polishing agent.",
      "Considerations": "High melting point, requires high firing temperatures.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Alumina Hydrate for lower temperature applications.",
      "Toxic": false
    },
    "Albany Slip Substitute": {
      "Chemical Composition": "Varies, generally a mixture of clay minerals",
      "Moles of Each Element": {
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 5,
        "Potassium": 1
      },
      "Physical Properties": "Dark brown to black powder, insoluble in water.",
      "Uses in Glazes": "Used to replicate the properties of Albany Slip.",
      "Other Applications": "Can be used as a clay body additive for color and texture.",
      "Considerations": "Formulations can vary, affecting final results.",
      "Health and Safety": "Generally considered safe for ceramic applications.",
      "Potential Substitutions": "Alberta Slip.",
      "Toxic": false
    },
    "Alberta Slip (Albany Slip Substitute)": {
      "Chemical Composition": "Varies, generally a mixture of clay minerals",
      "Moles of Each Element": {
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 5,
        "Potassium": 1
      },
      "Physical Properties": "Dark brown to black powder, insoluble in water.",
      "Uses in Glazes": "Used to replicate the properties of Albany Slip.",
      "Other Applications": "Can be used as a clay body additive for color and texture.",
      "Considerations": "Formulations can vary, affecting final results.",
      "Health and Safety": "Generally considered safe for ceramic applications.",
      "Potential Substitutions": "Albany Slip Substitute.",
      "Toxic": false
    },
    "APG Missouri (Fire Clay)": {
      "Chemical Composition": "Varies, generally a mixture of silica and alumina",
      "Moles of Each Element": {
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 5
      },
      "Physical Properties": "Grey to brown powder, insoluble in water.",
      "Uses in Glazes": "Used as a refractory material and to add texture.",
      "Other Applications": "Commonly used in high-temperature applications.",
      "Considerations": "High alumina content provides excellent refractory properties.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other fire clays.",
      "Toxic": false
    },
    "Barium Carbonate": {
      "Chemical Composition": "BaCO₃",
      "Moles of Each Element": {
        "Barium": 1,
        "Carbon": 1,
        "Oxygen": 3
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to prevent scumming in glazes.",
      "Other Applications": "Also used in brick, tile, and ceramic industries.",
      "Considerations": "Can be toxic if not handled properly.",
      "Health and Safety": "Toxic, handle with care and use protective equipment.",
      "Potential Substitutions": "Strontium carbonate.",
      "Toxic": true
    },
    "Bentonite - Western": {
      "Chemical Composition": "Varies, primarily montmorillonite",
      "Moles of Each Element": {
        "Silicon": 8,
        "Aluminum": 4,
        "Oxygen": 20,
        "Sodium": 1
      },
      "Physical Properties": "Fine, light gray powder, highly absorbent.",
      "Uses in Glazes": "Used to improve plasticity and suspend glazes.",
      "Other Applications": "Used in drilling mud, binder in foundry molds, and as a clarifying agent.",
      "Considerations": "High shrinkage can affect drying and firing.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other bentonites.",
      "Toxic": false
    },
    "Bone Ash- Synthetic": {
      "Chemical Composition": "Ca₃(PO₄)₂",
      "Moles of Each Element": {
        "Calcium": 3,
        "Phosphorus": 2,
        "Oxygen": 8
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used to increase glaze durability and create special effects.",
      "Other Applications": "Used in the production of bone china.",
      "Considerations": "Can affect glaze texture and melting properties.",
      "Health and Safety": "Generally safe, but dust can cause respiratory issues.",
      "Potential Substitutions": "Natural bone ash.",
      "Toxic": false
    },
    "Borax- Powdered": {
      "Chemical Composition": "Na₂B₄O₇·10H₂O",
      "Moles of Each Element": {
        "Sodium": 2,
        "Boron": 4,
        "Oxygen": 17,
        "Hydrogen": 20
      },
      "Physical Properties": "White crystalline powder, soluble in water.",
      "Uses in Glazes": "Used as a flux to lower melting temperature.",
      "Other Applications": "Used in detergents, cosmetics, and glass production.",
      "Considerations": "Can affect glaze stability and melting behavior.",
      "Health and Safety": "Generally safe, but can cause skin irritation.",
      "Potential Substitutions": "Colemanite.",
      "Toxic": false
    },
    "Burnt Umber": {
      "Chemical Composition": "Fe₂O₃ + MnO₂ + SiO₂",
      "Moles of Each Element": {
        "Iron": 2,
        "Oxygen": 3,
        "Manganese": 1,
        "Silicon": 1
      },
      "Physical Properties": "Brown powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant to produce brown hues.",
      "Other Applications": "Used in paints and artist pigments.",
      "Considerations": "Can vary in color intensity based on source.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Raw umber.",
      "Toxic": false
    },
    "C M C Powdered Gum": {
      "Chemical Composition": "Carboxymethyl cellulose",
      "Moles of Each Element": {
        "Carbon": 6,
        "Hydrogen": 10,
        "Oxygen": 5
      },
      "Physical Properties": "White powder, soluble in water.",
      "Uses in Glazes": "Used as a binder and thickener in glazes.",
      "Other Applications": "Used in food, pharmaceuticals, and cosmetics.",
      "Considerations": "Can affect glaze application properties.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other cellulose derivatives.",
      "Toxic": false
    },
    "Calcium Carbonate (Domestic Whiting)": {
      "Chemical Composition": "CaCO₃",
      "Moles of Each Element": {
        "Calcium": 1,
        "Carbon": 1,
        "Oxygen": 3
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in construction, agriculture, and food industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Dolomite.",
      "Toxic": false
    },
    "Calcium Carbonate (English Whiting)": {
      "Chemical Composition": "CaCO₃",
      "Moles of Each Element": {
        "Calcium": 1,
        "Carbon": 1,
        "Oxygen": 3
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in construction, agriculture, and food industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Dolomite.",
      "Toxic": false
    },
    "Cedar Heights Goldart": {
      "Chemical Composition": "Varies, primarily silica and alumina",
      "Moles of Each Element": {
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 5
      },
      "Physical Properties": "Tan powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for color and texture.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect plasticity and drying properties.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other stoneware clays.",
      "Toxic": false
    },
    "Cedar Heights Redart": {
      "Chemical Composition": "Varies, primarily silica and alumina",
      "Moles of Each Element": {
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 5
      },
      "Physical Properties": "Red to brown powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for color and texture.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect plasticity and drying properties.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other red clays.",
      "Toxic": false
    },
    "Chrome Oxide": {
      "Chemical Composition": "Cr₂O₃",
      "Moles of Each Element": {
        "Chromium": 2,
        "Oxygen": 3
      },
      "Physical Properties": "Green powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant to produce green hues.",
      "Other Applications": "Used in paints and coatings.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Toxic, handle with care and use protective equipment.",
      "Potential Substitutions": "Copper carbonate.",
      "Toxic": true
    },
    "Cobalt Carbonate": {
      "Chemical Composition": "CoCO₃",
      "Moles of Each Element": {
        "Cobalt": 1,
        "Carbon": 1,
        "Oxygen": 3
      },
      "Physical Properties": "Pink to purple powder, insoluble in water.",
      "Uses in Glazes": "Used to produce blue colors in glazes and underglazes.",
      "Other Applications": "Used in pottery, glass, and paint industries for coloring.",
      "Considerations": "High amounts can produce black or purple hues.",
      "Health and Safety": "Can be toxic if inhaled or ingested, handle with care.",
      "Potential Substitutions": "Cobalt Oxide.",
      "Toxic": true
    },
    "Cobalt Oxide": {
      "Chemical Composition": "Co₃O₄",
      "Moles of Each Element": {
        "Cobalt": 3,
        "Oxygen": 4
      },
      "Physical Properties": "Black powder, insoluble in water.",
      "Uses in Glazes": "Used to produce blue colors in glazes and underglazes.",
      "Other Applications": "Used in pottery, glass, and paint industries for coloring.",
      "Considerations": "High amounts can produce black hues.",
      "Health and Safety": "Can be toxic if inhaled or ingested, handle with care.",
      "Potential Substitutions": "Cobalt Carbonate.",
      "Toxic": true
    },
    "Copper Carbonate": {
      "Chemical Composition": "CuCO₃",
      "Moles of Each Element": {
        "Copper": 1,
        "Carbon": 1,
        "Oxygen": 3
      },
      "Physical Properties": "Green powder, insoluble in water.",
      "Uses in Glazes": "Used to produce green and blue colors in glazes.",
      "Other Applications": "Used in pottery, glass, and paint industries for coloring.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Toxic, handle with care and use protective equipment.",
      "Potential Substitutions": "Copper Oxide.",
      "Toxic": true
    },
    "Copper Oxide- Black": {
      "Chemical Composition": "CuO",
      "Moles of Each Element": {
        "Copper": 1,
        "Oxygen": 1
      },
      "Physical Properties": "Black powder, insoluble in water.",
      "Uses in Glazes": "Used to produce green and blue colors in glazes.",
      "Other Applications": "Used in pottery, glass, and paint industries for coloring.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Toxic, handle with care and use protective equipment.",
      "Potential Substitutions": "Copper Carbonate.",
      "Toxic": true
    },
    "Cornwall Stone Substitute": {
      "Chemical Composition": "Varies, generally a mixture of feldspar, silica, and alumina",
      "Moles of Each Element": {
        "Silicon": 3,
        "Aluminum": 1,
        "Oxygen": 8,
        "Potassium": 1
      },
      "Physical Properties": "White to gray powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Formulations can vary, affecting final results.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other feldspar substitutes.",
      "Toxic": false
    },
    "Dolomite (Limestone)": {
      "Chemical Composition": "CaMg(CO₃)₂",
      "Moles of Each Element": {
        "Calcium": 1,
        "Magnesium": 1,
        "Carbon": 2,
        "Oxygen": 6
      },
      "Physical Properties": "White to gray powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in construction, agriculture, and food industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Calcium carbonate.",
      "Toxic": false
    },
    "EPK (Kaolin)": {
      "Chemical Composition": "Al₂Si₂O₅(OH)₄",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Silicon": 2,
        "Oxygen": 9,
        "Hydrogen": 1
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, paper, and pharmaceutical industries.",
      "Considerations": "High shrinkage can affect drying and firing.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other kaolins.",
      "Toxic": false
    },
    "Epsom Salts": {
      "Chemical Composition": "MgSO₄·7H₂O",
      "Moles of Each Element": {
        "Magnesium": 1,
        "Sulfur": 1,
        "Oxygen": 4,
        "Hydrogen": 14
      },
      "Physical Properties": "White crystalline powder, soluble in water.",
      "Uses in Glazes": "Used as a flocculant and to promote crystal growth.",
      "Other Applications": "Used in bath salts, fertilizers, and medical applications.",
      "Considerations": "Can affect glaze stability and melting behavior.",
      "Health and Safety": "Generally safe, but can cause skin irritation.",
      "Potential Substitutions": "Magnesium carbonate.",
      "Toxic": false
    },
    "Ferro Frit 3110": {
      "Chemical Composition": "Varies, generally a mixture of boron, silica, and alumina",
      "Moles of Each Element": {
        "Boron": 2,
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 10
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other frits.",
      "Toxic": false

    },
    "Ferro Frit 3124": {
      "Chemical Composition": "Varies, generally a mixture of boron, silica, and alumina",
      "Moles of Each Element": {
        "Boron": 2,
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 10
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other frits.",
      "Toxic": false

    },
    "Ferro Frit 3134": {
      "Chemical Composition": "Varies, generally a mixture of boron, silica, and alumina",
      "Moles of Each Element": {
        "Boron": 2,
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 10
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other frits.",
      "Toxic": false
    },
    "Ferro Frit 3195": {
      "Chemical Composition": "Varies, generally a mixture of boron, silica, and alumina",
      "Moles of Each Element": {
        "Boron": 2,
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 10
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other frits.",
      "Toxic": false
    },
    "Ferro Frit 3249": {
      "Chemical Composition": "Varies, generally a mixture of boron, silica, and alumina",
      "Moles of Each Element": {
        "Boron": 2,
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 10
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other frits.",
      "Toxic": false
    },
    "Ferro Frit 3269": {
      "Chemical Composition": "Varies, generally a mixture of boron, silica, and alumina",
      "Moles of Each Element": {
        "Boron": 2,
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 10
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other frits.",
      "Toxic": false
    },
    "Ferro Frit 3278": {
      "Chemical Composition": "Varies, generally a mixture of boron, silica, and alumina",
      "Moles of Each Element": {
        "Boron": 2,
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 10
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other frits.",
      "Toxic": false
    },
    "Ferro Frit 3289": {
      "Chemical Composition": "Varies, generally a mixture of boron, silica, and alumina",
      "Moles of Each Element": {
        "Boron": 2,
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 10
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other frits.",
      "Toxic": false
    },
    "Ferro Frit 3292": {
      "Chemical Composition": "Varies, generally a mixture of boron, silica, and alumina",
      "Moles of Each Element": {
        "Boron": 2,
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 10
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other frits.",
      "Toxic": false
    },
    "Ferro Frit 3303": {
      "Chemical Composition": "Varies, generally a mixture of boron, silica, and alumina",
      "Moles of Each Element": {
        "Boron": 2,
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 10
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other frits.",
      "Toxic": false
    },
    "Ferro Frit 5301": {
      "Chemical Composition": "Varies, generally a mixture of boron, silica, and alumina",
      "Moles of Each Element": {
        "Boron": 2,
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 10
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other frits.",
      "Toxic": false
    },
    "Feldspar-Minspar 200":{
      "Chemical Composition": "Varies, generally a mixture of feldspar, silica, and alumina",
      "Moles of Each Element": {
        "Silicon": 3,
        "Aluminum": 1,
        "Oxygen": 8,
        "Potassium": 1
      },
      "Physical Properties": "White to gray powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other feldspars.",
      "Toxic": false
    },
    "Ferric Oxide - Red Iron Oxide": {
      "Chemical Composition": "Fe₂O₃",
      "Moles of Each Element": {
        "Iron": 2,
        "Oxygen": 3
      },
      "Physical Properties": "Red powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant to produce red hues.",
      "Other Applications": "Used in paints, ceramics, and pottery.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Red iron oxide.",
      "Toxic": false
    },
    "G200 EU Feldspar": {
      "Chemical Composition": "Varies, generally a mixture of feldspar, silica, and alumina",
      "Moles of Each Element": {
        "Silicon": 3,
        "Aluminum": 1,
        "Oxygen": 8,
        "Potassium": 1
      },
      "Physical Properties": "White to gray powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other feldspars.",
      "Toxic": false
    },
    "Georgia Diamond (Kaolin)": {
      "Chemical Composition": "Al₂Si₂O₅(OH)₄",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Silicon": 2,
        "Oxygen": 9,
        "Hydrogen": 1
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, paper, and pharmaceutical industries.",
      "Considerations": "High shrinkage can affect drying and firing.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other kaolins.",
      "Toxic": false
    },
    "Gerstley Borate Blend": {
      "Chemical Composition": "Varies, generally a mixture of boron, silica, and alumina",
      "Moles of Each Element": {
        "Boron": 2,
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 10
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other boron sources.",
      "Toxic": false
    },
    "GloMax (Calcined Kaolin)":{
      "Chemical Composition": "Al₂Si₂O₅(OH)₄",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Silicon": 2,
        "Oxygen": 9,
        "Hydrogen": 1
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, paper, and pharmaceutical industries.",
      "Considerations": "High shrinkage can affect drying and firing.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other kaolins.",
      "Toxic": false
    },
    "Granular Rutile" : {
      "Chemical Composition": "TiO₂",
      "Moles of Each Element": {
        "Titanium": 1,
        "Oxygen": 2
      },
      "Physical Properties": "Reddish-brown granules, insoluble in water.",
      "Uses in Glazes": "Used as a colorant and to create special effects in glazes.",
      "Other Applications": "Used in ceramics, paints, and coatings.",
      "Considerations": "Can affect glaze texture and melting properties.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Rutile.",
      "Toxic": false
    },
    "Grog- Coarse (10 -20 Mesh)" : {
      "Chemical Composition": "Varies, generally a mixture of silica, alumina, and other minerals",
      "Moles of Each Element": {
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 5
      },
      "Physical Properties": "Coarse particles, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for texture and strength.",
      "Other Applications": "Used in ceramics, pottery, and refractories.",
      "Considerations": "Can affect plasticity and shrinkage properties.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other grog sizes.",
      "Toxic": false
    },
    "Grog- Fine (35 - 100 Mesh)" : {
      "Chemical Composition": "Varies, generally a mixture of silica, alumina, and other minerals",
      "Moles of Each Element": {
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 5
      },
      "Physical Properties": "Fine particles, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for texture and strength.",
      "Other Applications": "Used in ceramics, pottery, and refractories.",
      "Considerations": "Can affect plasticity and shrinkage properties.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other grog sizes.",
      "Toxic": false
    },
    "Grog- Medium (20 - 48 Mesh)": {
      "Chemical Composition": "Varies, generally a mixture of silica, alumina, and other minerals",
      "Moles of Each Element": {
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 5
      },
      "Physical Properties": "Medium particles, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for texture and strength.",
      "Other Applications": "Used in ceramics, pottery, and refractories.",
      "Considerations": "Can affect plasticity and shrinkage properties.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other grog sizes.",
      "Toxic": false
    },
    "Grolleg (English Kaolin / China Clay)": {
      "Chemical Composition": "Al₂Si₂O₅(OH)₄",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Silicon": 2,
        "Oxygen": 9,
        "Hydrogen": 1
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, paper, and pharmaceutical industries.",
      "Considerations": "High shrinkage can affect drying and firing.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other kaolins.",
      "Toxic": false
    },
    "Hawthorn (Fire Clay) 40M" : {
      "Chemical Composition": "Varies, generally a mixture of silica and alumina",
      "Moles of Each Element": {
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 5
      },
      "Physical Properties": "Grey to brown powder, insoluble in water.",
      "Uses in Glazes": "Used as a refractory material and to add texture.",
      "Other Applications": "Commonly used in high-temperature applications.",
      "Considerations": "High alumina content provides excellent refractory properties.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other fire clays.",
      "Toxic": false
    },
    "Illmenite- Granular": {
      "Chemical Composition": "FeTiO₃",
      "Moles of Each Element": {
        "Iron": 1,
        "Titanium": 1,
        "Oxygen": 3
      },
      "Physical Properties": "Black granules, insoluble in water.",
      "Uses in Glazes": "Used as a colorant to produce black hues.",
      "Other Applications": "Used in ceramics, paints, and coatings.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Rutile.",
      "Toxic": false
    },
    "Iron Chromite" : {
      "Chemical Composition": "FeCr₂O₄",
      "Moles of Each Element": {
        "Iron": 1,
        "Chromium": 2,
        "Oxygen": 4
      },
      "Physical Properties": "Black powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant to produce black hues.",
      "Other Applications": "Used in ceramics, paints, and coatings.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Toxic, handle with care and use protective equipment.",
      "Potential Substitutions": "Chrome oxide.",
      "Toxic": true
    },
    "Iron Oxide- Black" : {
      "Chemical Composition": "Fe₃O₄",
      "Moles of Each Element": {
        "Iron": 3,
        "Oxygen": 4
      },
      "Physical Properties": "Black powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant to produce black hues.",
      "Other Applications": "Used in ceramics, paints, and coatings.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Toxic, handle with care and use protective equipment.",
      "Potential Substitutions": "Black iron oxide.",
      "Toxic": true
    },
    "Iron Oxide- Spanish Red" : {
      "Chemical Composition": "Fe₂O₃",
      "Moles of Each Element": {
        "Iron": 2,
        "Oxygen": 3
      },
      "Physical Properties": "Red powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant to produce red hues.",
      "Other Applications": "Used in ceramics, paints, and coatings.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Red iron oxide.",
      "Toxic": false
    },
    "Kentucky OM4 (Ball Clay)": {
      "Chemical Composition": "Varies, generally a mixture of kaolinite, mica, and quartz",
      "Moles of Each Element": {
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 5
      },
      "Physical Properties": "Gray to brown powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, pottery, and refractories.",
      "Considerations": "Can affect plasticity and shrinkage properties.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other ball clays.",
      "Toxic": false
    },
    "Magnesium Carbonate": {
      "Chemical Composition": "MgCO₃",
      "Moles of Each Element": {
        "Magnesium": 1,
        "Carbon": 1,
        "Oxygen": 3
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in construction, agriculture, and food industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Epsom salts.",
      "Toxic": false
    },
    "Manganese Dioxide": {
      "Chemical Composition": "MnO₂",
      "Moles of Each Element": {
        "Manganese": 1,
        "Oxygen": 2
      },
      "Physical Properties": "Black powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant to produce black hues.",
      "Other Applications": "Used in ceramics, paints, and coatings.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Toxic, handle with care and use protective equipment.",
      "Potential Substitutions": "Black iron oxide.",
      "Toxic": true
    },
    "Molochite (120 Mesh)": {
      "Chemical Composition": "Al₂SiO₅",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Silicon": 1,
        "Oxygen": 5
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for texture and strength.",
      "Other Applications": "Used in ceramics, pottery, and refractories.",
      "Considerations": "Can affect plasticity and shrinkage properties.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other grogs.",
      "Toxic": false
    },
    "Molochite (200 Mesh)" : {
      "Chemical Composition": "Al₂SiO₅",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Silicon": 1,
        "Oxygen": 5
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for texture and strength.",
      "Other Applications": "Used in ceramics, pottery, and refractories.",
      "Considerations": "Can affect plasticity and shrinkage properties.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other grogs.",
      "Toxic": false
    },
    "Molochite (30 Mesh)" : {
      "Chemical Composition": "Al₂SiO₅",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Silicon": 1,
        "Oxygen": 5
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for texture and strength.",
      "Other Applications": "Used in ceramics, pottery, and refractories.",
      "Considerations": "Can affect plasticity and shrinkage properties.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other grogs.",
      "Toxic": false
    },
    "Molochite (50 - 80 Mesh)" : {
      "Chemical Composition": "Al₂SiO₅",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Silicon": 1,
        "Oxygen": 5
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for texture and strength.",
      "Other Applications": "Used in ceramics, pottery, and refractories.",
      "Considerations": "Can affect plasticity and shrinkage properties.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other grogs.",
      "Toxic": false
    },
    "Nepheline Syenite": {
      "Chemical Composition": "Varies, generally a mixture of feldspar, silica, and alumina",
      "Moles of Each Element": {
        "Silicon": 3,
        "Aluminum": 1,
        "Oxygen": 8,
        "Potassium": 1
      },
      "Physical Properties": "White to gray powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other feldspars.",
      "Toxic": false
    },
    "Nickel Carbonate, Purified": {
      "Chemical Composition": "NiCO₃",
      "Moles of Each Element": {
        "Nickel": 1,
        "Carbon": 1,
        "Oxygen": 3
      },
      "Physical Properties": "Green powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant to produce green hues.",
      "Other Applications": "Used in ceramics, paints, and coatings.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Toxic, handle with care and use protective equipment.",
      "Potential Substitutions": "Copper carbonate.",
      "Toxic": true
    },
    "Nickel Oxide- Black": {
      "Chemical Composition": "NiO",
      "Moles of Each Element": {
        "Nickel": 1,
        "Oxygen": 1
      },
      "Physical Properties": "Black powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant to produce black hues.",
      "Other Applications": "Used in ceramics, paints, and coatings.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Toxic, handle with care and use protective equipment.",
      "Potential Substitutions": "Nickel carbonate.",
      "Toxic": true
    },
    "Nickel Oxide- Green" : {
      "Chemical Composition": "NiO",
      "Moles of Each Element": {
        "Nickel": 1,
        "Oxygen": 1
      },
      "Physical Properties": "Green powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant to produce green hues.",
      "Other Applications": "Used in ceramics, paints, and coatings.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Toxic, handle with care and use protective equipment.",
      "Potential Substitutions": "Nickel carbonate.",
      "Toxic": true
    },
    "Ochre, Yellow": {
      "Chemical Composition": "Varies, generally a mixture of iron oxides and clays",
      "Moles of Each Element": {
        "Iron": 1,
        "Oxygen": 2
      },
      "Physical Properties": "Yellow powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant to produce yellow hues.",
      "Other Applications": "Used in ceramics, paints, and coatings.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Yellow iron oxide.",
      "Toxic": false
    },
    "Plaster- Hydrocal" : {
      "Chemical Composition": "CaSO₄·2H₂O",
      "Moles of Each Element": {
        "Calcium": 1,
        "Sulfur": 1,
        "Oxygen": 4,
        "Hydrogen": 4
      },
      "Physical Properties": "White powder, soluble in water.",
      "Uses in Glazes": "Used to make plaster molds and forms.",
      "Other Applications": "Used in construction, art, and medical industries.",
      "Considerations": "High water absorption and setting time.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Pottery plaster.",
      "Toxic": false
    },
    "Plastic Vitrox": {
      "Chemical Composition": "Varies, generally a mixture of feldspar, silica, and alumina",
      "Moles of Each Element": {
        "Silicon": 3,
        "Aluminum": 1,
        "Oxygen": 8,
        "Potassium": 1
      },
      "Physical Properties": "White to gray powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramic and pottery industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other feldspars.",
      "Toxic": false
    },
    "Potassium Carbonate (Pearl Ash)" : {
      "Chemical Composition": "K₂CO₃",
      "Moles of Each Element": {
        "Potassium": 2,
        "Carbon": 1,
        "Oxygen": 3
      },
      "Physical Properties": "White powder, soluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in glass, soap, and food industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Potassium feldspar.",
      "Toxic": false
    },
    "Pyrophyllite (Pyrax)": {
      "Chemical Composition": "Al₂Si₄O₁₀(OH)₂",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Silicon": 4,
        "Oxygen": 10,
        "Hydrogen": 2
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, paper, and pharmaceutical industries.",
      "Considerations": "High shrinkage can affect drying and firing.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other pyrophyllites.",
      "Toxic": false
    },
    "Albion Form 100": {
      "Chemical Composition": "Al₂Si₂O₅(OH)₄",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Silicon": 2,
        "Oxygen": 9,
        "Hydrogen": 1
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, paper, and pharmaceutical industries.",
      "Considerations": "High shrinkage can affect drying and firing.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other kaolins.",
      "Toxic": false
    },
    "Arcilla de Pontezuelo (Cuba)": {
      "Chemical Composition": "Al₂Si₂O₅(OH)₄",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Silicon": 2,
        "Oxygen": 9,
        "Hydrogen": 1
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, paper, and pharmaceutical industries.",
      "Considerations": "High shrinkage can affect drying and firing.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other kaolins.",
      "Toxic": false
    },
    "Ravenscrag Slip": {
      "Chemical Composition": "Al₂Si₂O₅(OH)₄",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Silicon": 2,
        "Oxygen": 9,
        "Hydrogen": 1
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, paper, and pharmaceutical industries.",
      "Considerations": "High shrinkage can affect drying and firing.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other kaolins.",
      "Toxic": false
    },
    "Rutile, Powdered- Light": {
      "Chemical Composition": "TiO₂",
      "Moles of Each Element": {
        "Titanium": 1,
        "Oxygen": 2
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant and to create special effects in glazes.",
      "Other Applications": "Used in ceramics, paints, and coatings.",
      "Considerations": "Can affect glaze texture and melting properties.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Rutile.",
      "Toxic": false
    },
    "Silica (Flint) (200 Mesh)": {
      "Chemical Composition": "SiO₂",
      "Moles of Each Element": {
        "Silicon": 1,
        "Oxygen": 2
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a glass former and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramics, glass, and construction industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Quartz.",
      "Toxic": false
    },
    "Silica (Flint) (325 Mesh)" : {
      "Chemical Composition": "SiO₂",
      "Moles of Each Element": {
        "Silicon": 1,
        "Oxygen": 2
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a glass former and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramics, glass, and construction industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Quartz.",
      "Toxic": false
    },
    "Silica (Flint) (400 Mesh)" : {
      "Chemical Composition": "SiO₂",
      "Moles of Each Element": {
        "Silicon": 1,
        "Oxygen": 2
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a glass former and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramics, glass, and construction industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Quartz.",
      "Toxic": false
    },
    "Silica Sand": {
      "Chemical Composition": "SiO₂",
      "Moles of Each Element": {
        "Silicon": 1,
        "Oxygen": 2
      },
      "Physical Properties": "White to gray sand, insoluble in water.",
      "Uses in Glazes": "Used as a glass former and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramics, glass, and construction industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Quartz.",
      "Toxic": false
    },
    "Silicon Carbide (250 Mesh)":{
      "Chemical Composition": "SiC",
      "Moles of Each Element": {
        "Silicon": 1,
        "Carbon": 1
      },
      "Physical Properties": "Black powder, insoluble in water.",
      "Uses in Glazes": "Used as a refractory material and to add texture.",
      "Other Applications": "Commonly used in high-temperature applications.",
      "Considerations": "High thermal conductivity and hardness.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other silicon carbide sizes.",
      "Toxic": false
    },
    "Silicon Carbide- Ultrafine (1000 Mesh)": {
      "Chemical Composition": "SiC",
      "Moles of Each Element": {
        "Silicon": 1,
        "Carbon": 1
      },
      "Physical Properties": "Black powder, insoluble in water.",
      "Uses in Glazes": "Used as a refractory material and to add texture.",
      "Other Applications": "Commonly used in high-temperature applications.",
      "Considerations": "High thermal conductivity and hardness.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other silicon carbide sizes.",
      "Toxic": false
    },
    "Soda Ash": {
      "Chemical Composition": "Na₂CO₃",
      "Moles of Each Element": {
        "Sodium": 2,
        "Carbon": 1,
        "Oxygen": 3
      },
      "Physical Properties": "White powder, soluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in glass, soap, and food industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Sodium feldspar.",
      "Toxic": false
    },
    "Spodumene": {
      "Chemical Composition": "LiAlSi₂O₆",
      "Moles of Each Element": {
        "Lithium": 1,
        "Aluminum": 1,
        "Silicon": 2,
        "Oxygen": 6
      },
      "Physical Properties": "White to gray powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramics, glass, and construction industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Lithium carbonate.",
      "Toxic": false
    },
    "Strontium Carbonate": {
      "Chemical Composition": "SrCO₃",
      "Moles of Each Element": {
        "Strontium": 1,
        "Carbon": 1,
        "Oxygen": 3
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramics, glass, and construction industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Barium carbonate.",
      "Toxic": false
    },
    "Talc, (BT2213 Fabi)": {
      "Chemical Composition": "Mg₃Si₄O₁₀(OH)₂",
      "Moles of Each Element": {
        "Magnesium": 3,
        "Silicon": 4,
        "Oxygen": 10,
        "Hydrogen": 2
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, paper, and pharmaceutical industries.",
      "Considerations": "High shrinkage can affect drying and firing.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other talcs.",
      "Toxic": false
    },
    "Tennessee No. 1 (Ball Clay)": {
      "Chemical Composition": "Varies, generally a mixture of kaolinite, mica, and quartz",
      "Moles of Each Element": {
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 5
      },
      "Physical Properties": "Gray to brown powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, pottery, and refractories.",
      "Considerations": "Can affect plasticity and shrinkage properties.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other ball clays.",
      "Toxic": false
    },
    "Tennessee No. 5 (Ball Clay)": {
      "Chemical Composition": "Varies, generally a mixture of kaolinite, mica, and quartz",
      "Moles of Each Element": {
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 5
      },
      "Physical Properties": "Gray to brown powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, pottery, and refractories.",
      "Considerations": "Can affect plasticity and shrinkage properties.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other ball clays.",
      "Toxic": false
    },
    "Tile #6 (Kaolin)": {
      "Chemical Composition": "Al₂Si₂O₅(OH)₄",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Silicon": 2,
        "Oxygen": 9,
        "Hydrogen": 1
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, paper, and pharmaceutical industries.",
      "Considerations": "High shrinkage can affect drying and firing.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other kaolins.",
      "Toxic": false
    },
    "Tin Oxide": {
      "Chemical Composition": "SnO₂",
      "Moles of Each Element": {
        "Tin": 1,
        "Oxygen": 2
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant to produce white hues.",
      "Other Applications": "Used in ceramics, paints, and coatings.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Toxic, handle with care and use protective equipment.",
      "Potential Substitutions": "Zirconium silicate.",
      "Toxic": true
    },
    "Titanium Dioxide" : {
      "Chemical Composition": "TiO₂",
      "Moles of Each Element": {
        "Titanium": 1,
        "Oxygen": 2
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant and to create special effects in glazes.",
      "Other Applications": "Used in ceramics, paints, and coatings.",
      "Considerations": "Can affect glaze texture and melting properties.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Rutile.",
      "Toxic": false
    },
    "Veegum CER": {
      "Chemical Composition": "Al₂Si₂O₅(OH)₄",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Silicon": 2,
        "Oxygen": 9,
        "Hydrogen": 1
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, paper, and pharmaceutical industries.",
      "Considerations": "High shrinkage can affect drying and firing.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other kaolins.",
      "Toxic": false
    },
    "Veegum T":  {
      "Chemical Composition": "Al₂Si₂O₅(OH)₄",
      "Moles of Each Element": {
        "Aluminum": 2,
        "Silicon": 2,
        "Oxygen": 9,
        "Hydrogen": 1
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, paper, and pharmaceutical industries.",
      "Considerations": "High shrinkage can affect drying and firing.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other kaolins.",
      "Toxic": false
    },
    "Volcanic Ash (Pumice)": {
      "Chemical Composition": "Varies, generally a mixture of silica, alumina, and other minerals",
      "Moles of Each Element": {
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 5
      },
      "Physical Properties": "Light gray powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for texture and strength.",
      "Other Applications": "Used in ceramics, pottery, and refractories.",
      "Considerations": "Can affect plasticity and shrinkage properties.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other volcanic ashes.",
      "Toxic": false
    },
    "Wollastonite W-20": {
      "Chemical Composition": "CaSiO₃",
      "Moles of Each Element": {
        "Calcium": 1,
        "Silicon": 1,
        "Oxygen": 3
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a flux and to adjust glaze melting temperature.",
      "Other Applications": "Used in ceramics, glass, and construction industries.",
      "Considerations": "Can affect glaze color and texture.",
      "Health and Safety": "Generally safe, but inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Calcium carbonate.",
      "Toxic": false
    },
    "XX Sagger (Ball Clay)": {
      "Chemical Composition": "Varies, generally a mixture of kaolinite, mica, and quartz",
      "Moles of Each Element": {
        "Silicon": 2,
        "Aluminum": 1,
        "Oxygen": 5
      },
      "Physical Properties": "Gray to brown powder, insoluble in water.",
      "Uses in Glazes": "Used as a clay body additive for plasticity and texture.",
      "Other Applications": "Used in ceramics, pottery, and refractories.",
      "Considerations": "Can affect plasticity and shrinkage properties.",
      "Health and Safety": "Inhalation of dust can cause respiratory issues.",
      "Potential Substitutions": "Other ball clays.",
      "Toxic": false
    },
    "Zinc Oxide (Not Calcined)": {
      "Chemical Composition": "ZnO",
      "Moles of Each Element": {
        "Zinc": 1,
        "Oxygen": 1
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant to produce white hues.",
      "Other Applications": "Used in ceramics, paints, and coatings.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Toxic, handle with care and use protective equipment.",
      "Potential Substitutions": "Zinc oxide (calcined).",
      "Toxic": true
    },
    "Zircopax Plus (Ultrox)": {
      "Chemical Composition": "ZrSiO₄",
      "Moles of Each Element": {
        "Zirconium": 1,
        "Silicon": 1,
        "Oxygen": 4
      },
      "Physical Properties": "White powder, insoluble in water.",
      "Uses in Glazes": "Used as a colorant to produce white hues.",
      "Other Applications": "Used in ceramics, paints, and coatings.",
      "Considerations": "Can affect glaze stability and melting properties.",
      "Health and Safety": "Toxic, handle with care and use protective equipment.",
      "Potential Substitutions": "Zirconium silicate.",
      "Toxic": true
    }
  }
}
