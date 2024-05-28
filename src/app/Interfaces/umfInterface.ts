export interface UmfInterface {
  fluxes: {
    R2O: {
      K2O: number;
      Na2O: number;
    };
    RO: {
      CaO: number;
      MgO: number;
    };
  };
  stabilizers: {
    R2O3: {
      Al2O3: number;
      Fe2O3?: number;
    };
    B2O3: number;
  };
  silicas: {
    SiO2: number;
    TiO2?: number;
  };
  other?: {
    LOI?: number;
    P2O5?: number;
    MnO?: number;
    Cl?: number;
  };
}
