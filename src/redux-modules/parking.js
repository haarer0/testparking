import { findParkingPlace } from '../services/serverInterface'

export const PARKING_EVENTS = {
	ARRIVED: 'PARKING::ARRIVED',
	DEPARTED: 'PARKING::DEPARTED',
	NOFREESPACE: 'PARKING::NO_FREE_PLACES',
	PROCESSING: 'PARKING::PROCESSING',
}


export const actionCarArrived = (carType, parkingId) => {
	return (dispatch, getState) => {
		findParkingPlace(parkingId, carType).then((result) => {
			if (result.isSuccessfull) {
				const {placeId, carId} = result
				dispatch(onParkedCar(parkingId, placeId, carType, carId))
			}
			else
				dispatch(onParkingNoPlaces(parkingId, carType))
		})

		dispatch({
			type: PARKING_EVENTS.PROCESSING,
			payload: {
				parkingId
			}
		})

	}
}


export const actionCarDeparted = (carId, placeId, parkingId) => {

	return (dispatch, getState) => {
		const found = Object.entries(getState().parkings[parkingId].placesData).filter(e => {
			return e[1].carId === carId
		})[0]

		if (!found) return
		return dispatch({
			type: PARKING_EVENTS.DEPARTED,
			payload: {
				parkingId: 0,
				placeId: found[0]
			}
		})

	}
}

export const onParkedCar = (parkingId, placeId, carType, carId) => {
	return {
		type: PARKING_EVENTS.ARRIVED,
		payload: {
			parkingId,
			placeId,
			carType,
			carId
		}
	}
}
export const onParkingNoPlaces = (parkingId, carType) => {
	return {
		type: PARKING_EVENTS.NOFREESPACE,
		payload: {
			parkingId,
			carType
		}
	}
}

const parkingReducer = (state = {}, action) => {
	switch (action.type) {
		case PARKING_EVENTS.ARRIVED : {
			const {parkingId, placeId, carType, carId} = action.payload
			return {
				...state,
				[parkingId]: {
					...state[parkingId],
					isProcessing: false,
					placesLeft: state[parkingId].placesLeft - 1,
					placesData: {
						...state[parkingId].placesData,
						[placeId]: {
							...state[parkingId].placesData[placeId],
							isOccupied: true,
							carType,
							carId
						}
					}
				}
			}
		}

		case PARKING_EVENTS.DEPARTED : {
			const {parkingId, placeId} = action.payload
			return {
				...state,
				[parkingId]: {
					...state[parkingId],
					isProcessing: false,
					placesLeft: state[parkingId].placesLeft + 1,
					placesData: {
						...state[parkingId].placesData,
						[placeId]: {
							...state[parkingId].placesData[placeId],
							isOccupied: false,
							carType: null,
							carId: null
						}
					}
				}
			}

		}

		case PARKING_EVENTS.NOFREESPACE : {
			const {parkingId} = action.payload
			return {
				...state,
				[parkingId]: {
					...state[parkingId],
					isProcessing: false
				}
			}
		}

		case PARKING_EVENTS.PROCESSING : {
			const {parkingId} = action.payload
			return {
				...state,
				[parkingId]: {
					...state[parkingId],
					isProcessing: true
				}
			}
		}

		default: return state
	}
}

export default parkingReducer