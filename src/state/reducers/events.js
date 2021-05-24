import {
	SET_EVENTS,
	ADD_EVENT,
	DELETE_EVENT,
	EDIT_EVENT,
} from "../types/events";

const events = (state, action) => {
	const { type, payload } = action;
	switch (type) {
		case SET_EVENTS:
			return payload;
		case ADD_EVENT:
			return [...state, payload];
		case DELETE_EVENT:
			return state.filter((event) => event.id !== payload);
		case EDIT_EVENT:
			const events = [...state];
			const index = events.findIndex((event) => event.id === payload.id);
			events[index] = payload;
			return events;
		default:
			return state;
	}
};

export default events;
