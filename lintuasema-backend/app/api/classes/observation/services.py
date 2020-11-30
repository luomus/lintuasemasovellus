
def parseCountString(obs):
    #'adultUnknownCount': each.adultUnknownCount, 'adultFemaleCount': each.adultFemaleCount, 'adultMaleCount': each.adultMaleCount,
    #         'juvenileUnknownCount': each.juvenileUnknownCount, 'juvenileFemaleCount': each.juvenileFemaleCount, 'juvenileMaleCount': each.juvenileMaleCount,
    #         'subadultUnknownCount': each.subadultUnknownCount, 'subadultFemaleCount': each.subadultFemaleCount, 'subadultMaleCount': each.subadultMaleCount,
    #         'unknownUnknownCount': each.unknownUnknownCount, 'unknownFemaleCount': each.unknownFemaleCount, 'unknownMaleCount': each.unknownMaleCount,
    countString = ""
    if obs.adultUnknownCount != 0:
        countString = countString + str(obs.adultUnknownCount) + " tunt. sukupuolta (aikuinen), "
    if obs.adultFemaleCount != 0:
        countString = countString + str(obs.adultFemaleCount) + " naarasta (aikuinen), "
    if obs.adultMaleCount != 0:
        countString = countString + str(obs.adultMaleCount) + " koirasta (aikuinen), "
    if obs.juvenileUnknownCount != 0:
        countString = countString + str(obs.juvenileUnknownCount) + " tunt. sukupuolta (poikanen), "
    if obs.juvenileFemaleCount != 0:
        countString = countString + str(obs.juvenileFemaleCount) + " naarasta (poikanen), "
    if obs.juvenileMaleCount != 0:
        countString = countString + str(obs.juvenileMaleCount) + " koirasta (poikanen), "
    if obs.subadultUnknownCount != 0:
        countString = countString + str(obs.subadultUnknownCount) + " tunt. sukupuolta (esiaikuinen), "
    if obs.subadultFemaleCount != 0:
        countString = countString + str(obs.subadultFemaleCount) + " naarasta (esiaikuinen), "
    if obs.subadultMaleCount != 0:
        countString = countString + str(obs.subadultMaleCount) + " koirasta (esiaikuinen), "
    if obs.unknownUnknownCount != 0:
        countString = countString + str(obs.unknownUnknownCount) + " tunt. sukupuolta (tunt. ikä), "
    if obs.unknownFemaleCount != 0:
        countString = countString + str(obs.unknownFemaleCount) + " naarasta (tunt. ikä), "
    if obs.unknownMaleCount != 0:
        countString = countString + str(obs.unknownMaleCount) + " koirasta (tunt. ikä), "
    countString = countString[0:(len(countString) - 2)]
    return countString

def deleteObservation(shorthand_id):
    observation = Observation.query.filter_by(shorthand_id).first()
    observation.is_deleted = 1