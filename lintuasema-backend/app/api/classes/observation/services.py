
def parseCountString(obs):
    #'adultUnknownCount': each.adultUnknownCount, 'adultFemaleCount': each.adultFemaleCount, 'adultMaleCount': each.adultMaleCount,
    #         'juvenileUnknownCount': each.juvenileUnknownCount, 'juvenileFemaleCount': each.juvenileFemaleCount, 'juvenileMaleCount': each.juvenileMaleCount,
    #         'subadultUnknownCount': each.subadultUnknownCount, 'subadultFemaleCount': each.subadultFemaleCount, 'subadultMaleCount': each.subadultMaleCount,
    #         'unknownUnknownCount': each.unknownUnknownCount, 'unknownFemaleCount': each.unknownFemaleCount, 'unknownMaleCount': each.unknownMaleCount,
    countString = ""
    if obs.adultUnknownCount != 0:
        countString = countString + obs.adultUnknownCount + " tunt. sukupuoli (aikuinen)\n"
    if obs.adultFemaleCount != 0:
        countString = countString + obs.adultFemaleCount + " naaras (aikuinen)\n"
    if obs.adultMaleCount != 0:
        countString = countString + obs.adultMaleCount + " koiras (aikuinen)\n"
    if obs.juvenileUnknownCount != 0:
        countString = countString + obs.juvenileUnknownCount + " tunt. sukupuoli (poikanen)\n"
    if obs.juvenileFemaleCount != 0:
        countString = countString + obs.juvenileFemaleCount + " naaras (poikanen)\n"
    if obs.juvenileMaleCount != 0:
        countString = countString + obs.juvenileMaleCount + " koiras (poikanen)\n"
    if obs.subadultUnknownCount != 0:
        countString = countString + obs.subadultUnknownCount + "tunt. sukupuoli (esiaikuinen)\n"
    if obs.subAdultFemaleCount != 0:
        countString = countString + obs.subadultFemaleCount + " naaras (esiaikuinen)\n"
    if obs.subadultMaleCount != 0:
        countString = countString + obs.subadultMaleCount + " koiras (esiaikuinen)\n"
    if obs.unknownUnknownCount != 0:
        countString = countString + obs.unknownUnknownCount + " tuntematon ikä ja sukupuoli\n"
    if obs.unknownFemaleCount != 0:
        countString = countString + obs.unknownFemaleCount + " naaras (tunt. ikä)\n"
    if obs.unknownMaleCount != 0:
        countString = countString + obs.unknownMaleCount + " koiras (tunt. ikä)\n"

    return countString

