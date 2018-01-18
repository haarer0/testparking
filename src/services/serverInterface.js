const generateParkingLayout = (...parkingConfigs) => {
	let data = {}, i, pId, placeId

	for (pId = 0; pId < parkingConfigs.length; pId++) {
		const { normalPlaces, truckPlaces, disabledPlaces } = parkingConfigs[pId]
		const totalPlaces = normalPlaces + truckPlaces + disabledPlaces
		let parkingLayout = {}
		placeId = 1

		for (i = 0; i < normalPlaces; i++)
			parkingLayout[placeId++] = {placeType: 'n', isOccupied: false}
		for (i = 0; i < truckPlaces; i++)
			parkingLayout[placeId++] = {placeType: 't', isOccupied: false}
		for (i = 0; i < disabledPlaces; i++)
			parkingLayout[placeId++] = {placeType: 'd', isOccupied: false}

		data[pId] = { placesData: parkingLayout, totalPlaces, placesLeft: totalPlaces }
	}


	return data
}

export const getDataFromDB = () => {
	const storedData = localStorage.getItem('parking-initialData')
	if (storedData) return JSON.parse(storedData)

	const data = {
		parkings: generateParkingLayout({
				normalPlaces: 3,
				truckPlaces: 2,
				disabledPlaces: 1
			}
		)
	}

	return data
}


export const saveDataToDB = (state) => {
	localStorage.setItem('parking-initialData', JSON.stringify(state))
}

const generateNewCarId = () => {
	let id = localStorage.getItem('cars-lastAssignedCarId') || 0
	id++
	localStorage.setItem('cars-lastAssignedCarId', id)
	return id
}

const findPlaceByCarType = (parkingId, carType) => {
    const { placesData } = getDataFromDB().parkings[parkingId]

    let found = []

	switch (carType) {
		case 's' : 	found = Object.entries(placesData).filter(a => {
						return !a[1].isOccupied && (a[1].placeType === 'n' || a[1].placeType === 't')
					}).sort((a, b) => {
						switch (a[1].placeType) {
							case 'n' : return -1
							case 't' : return 1
							default : return 0
						}
					})
					break

		case 't' : 	found = Object.entries(placesData).filter(a => {
						return !a[1].isOccupied && a[1].placeType === 't'
					})
					break

		case 'd' : 	found = Object.entries(placesData).filter(a => {
						return !a[1].isOccupied
					}).sort((a, b) => {
						switch (a[1].placeType) {
							case 'd' :
								switch (b[1].placeType) {
									case 'n' : return -1
									case 'd' : return 0
									case 't' :
									default: return 1
								}
							case 's' :
								switch (b[1].placeType) {
									case 't' : return -1
									case 'd' : return 1
									case 'n' :
									default: return 0
								}
							case 't' :
								switch (b[1].placeType) {
									case 'd' : return 1
									case 'n' : return 1
									case 't' :
									default: return 0
								}
							default : return 0
						}
					})
					break

		default: return 0
	}
console.log(found)
	return found.length ? found[0][0] : 0
}

function emulate_ProcessingFindParkingPlace(parkingId, carType) {
  return new Promise(resolve => {
    setTimeout(() => {
    	const newPlaceId = findPlaceByCarType(parkingId, carType)
    	if (newPlaceId > 0)
			resolve({isSuccessfull: true, parkingId, placeId: newPlaceId, carId: generateNewCarId()})
		else
			resolve({isSuccessfull: false, parkingId, placeId: 0, carId: 0})
    }, 1000);
  });
}

export async function findParkingPlace(parkingId, carType) {
	var x = await emulate_ProcessingFindParkingPlace(parkingId, carType)
	return x
}