export interface Observation {
    adultUnknownCount: number;
    adultFemaleCount: number;
    adultMaleCount: number;
    juvenileUnknownCount: number;
    juvenileFemaleCount: number;
    juvenileMaleCount: number;
    subadultUnknownCount: number;
    subadultFemaleCount: number;
    subadultMaleCount: number;
    chickUnknownCount: number;
    chickFemaleCount: number;
    chickMaleCount: number;
    unknownUnknownCount: number;
    unknownFemaleCount: number;
    unknownMaleCount: number;
    direction: string;
    bypassSide: string;
    notes: string;
}

export interface FullObservation {
    species: string;
    subObservations: Observation[];
}

export interface ObservationPeriod {
    location: string;
    startTime: string;
    endTime: string;
    shorthandBlock: string;
    observationType: string;
}

export interface PeriodObservation extends FullObservation {
    periodOrderNum: string;
}
