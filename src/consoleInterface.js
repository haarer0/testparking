import {getDataFromDB} from './services/serverInterface'

import store from './redux-modules/store'

import {actionCarArrived, actionCarDeparted} from './redux-modules/parking'

const formatParkingLayoutState = (parkingData = {}, parkingId = 0, rows = 6, cols = 5) => {
	let placeId = 1, str = ''
	const { placesData, placesLeft } = parkingData[parkingId]
	console.log('Places left on parking[' + parkingId + ']: ' + placesLeft);
	for (var i = 0; i < rows; i++) {
		 for (var j = 0; j < cols; j++) {
		 	if (!placesData[placeId]) return str

			const { placeType, isOccupied, carType, carId} = placesData[placeId]
			let occupiedStr = '        '

			if (isOccupied) {
				const carIdStr = '' + carId
				const formattedCarType = carType.substr(0,1).toUpperCase()
				occupiedStr = `(${formattedCarType} #${'000'.substr(carIdStr.length) + carIdStr})`
			}

			str += `[${(placeId < 10 ? '0' : '') + placeId}.${placeType.substr(0, 1).toLowerCase()} ${occupiedStr}]`
			placeId++
		}
		str += '\n ';
	}

	return str
}

const showHelp = () => {
	const functionStyles = 'font-size: 14px; color: #262'
	const argumentsStyles = 'font-size: 12px; color: #226; background:#eee;'
	const descriptionStyles = 'font-size: 10px; color: #888'

	console.log('%c window.parking.commands() | window.help()%c - displays this help', functionStyles, descriptionStyles);
	console.log('%c window.parking.db.generateInitialData() | window.dgid()%c - generates initial data in localStorage', functionStyles, descriptionStyles);
	console.log('%c window.parking.db.resetInitialData() | window.drid()%c - resets data in localStorage (and reloads the page).', functionStyles, descriptionStyles);
	console.log('%c window.parking.db.showSavedData() | window.dssd()%c - shows actual information stored in localStorage\n', functionStyles, descriptionStyles);
	console.log('%c window.parking.display.printParkingLayout(%cparkingId = 0%c) | windows.ppl(%cparkingId = 0)%c - displays specific parking layout in pseudographics.', functionStyles, argumentsStyles, functionStyles, argumentsStyles, functionStyles, descriptionStyles);

	console.log('%c window.parking.actions.arrive(%ccarType = \'s\', parkingId = 0%c) | windows.arrive(%c carType = \'s\', parkingId = 0%c)%c - simulates car (with specific carType from [\'s\', \'t\', \'d\']) arriving to parking. Once a parking place is found by the server, a new carId will be generated and assigned to the car', functionStyles, argumentsStyles, functionStyles, argumentsStyles, functionStyles, descriptionStyles);
	console.log('%c window.parking.actions.depart(%ccarId, parkingId = 0%c) | windows.depart(%c carId, parkingId = 0%c)%c - simulates departing car (by its carId) from the parking', functionStyles, argumentsStyles, functionStyles, argumentsStyles, functionStyles, descriptionStyles);
}

const setConsoleInterface = () => {
	console.log('%c Parking site test example ', 'background: #ddd; color: #333; text-align: center; font-size: 20px');
	console.log('%c Adding the following shortcuts to window ', 'background: #ddd; color: #633');
	showHelp()
	console.log('%c HAPPY TESTING!\n\n', 'color: #633;font-size: 20px');

	window.parking = {
		commands: showHelp,
		db: {
			generateInitialData: () => { getDataFromDB() },
			resetInitialData: () => { localStorage.removeItem('parking-initialData'); document.location.reload(true)},
			showSavedData: () => { console.log(localStorage.getItem('parking-initialData'))},
		},
		display: {
			printParkingLayout: (parkingId = 0) => { return formatParkingLayoutState(store.getState().parkings, parkingId) }
		},
		actions: {
			arrive: (carType = 's', parkingId = 0) => { store.dispatch(actionCarArrived(carType, parkingId)) },
			depart: (carId, placeId, parkingId = 0) => { store.dispatch(actionCarDeparted(carId, placeId, parkingId)) }
		}
	}


	window.help = showHelp
	window.dgid = window.parking.db.generateInitialData
	window.drid = window.parking.db.resetInitialData
	window.dssd = window.parking.db.showSavedData
	window.ppl = window.parking.display.printParkingLayout
	window.arrive = window.parking.actions.arrive
	window.depart = window.parking.actions.depart
}

export default setConsoleInterface