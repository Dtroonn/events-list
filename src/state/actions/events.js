import {
	SET_EVENTS,
	ADD_EVENT,
	DELETE_EVENT,
	EDIT_EVENT,
} from "../types/events";

export const setEvents = (items) => ({
	type: SET_EVENTS,
	payload: items,
});

export const addEvent = (item) => ({
	type: ADD_EVENT,
	payload: item,
});

export const deleteEvent = (id) => ({
	type: DELETE_EVENT,
	payload: id,
});

export const editEvent = (data) => ({
	type: EDIT_EVENT,
	payload: data,
});
