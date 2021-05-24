import React from "react";
import { Link } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import StaticDatePicker from "@material-ui/lab/StaticDatePicker";
import PickersDay from "@material-ui/lab/PickersDay";

import { EventsList } from "../components";

import { deleteEvent } from "../state/actions/events";

const selectHighlightedDays = (events, month) => {
	let highlightedDays = [];
	events.forEach((event) => {
		const [eventYear, eventMonth, eventDay] = event.date.split("-");
		if (Number(eventMonth) === month) {
			highlightedDays.push(Number(eventDay));
		}
	});
	return highlightedDays;
};

const deleteEventFromLocalStorage = (id) => {
	const events = JSON.parse(localStorage.getItem("events"));
	localStorage.setItem(
		"events",
		JSON.stringify(events.filter((event) => event.id !== id))
	);
};

export default function Home({ events, dispatch }) {
	const [date, setDate] = React.useState(new Date());
	const [highlightedDays, setHighlightedDays] = React.useState([]);

	React.useEffect(() => {
		setHighlightedDays(selectHighlightedDays(events, date.getMonth() + 1));
	}, [events]);

	const handleMonthChange = (date) => {
		setHighlightedDays(selectHighlightedDays(events, date.getMonth() + 1));
	};

	const filteredEventsByDate = events.filter(
		(event) => event.date === date.toISOString().substring(0, 10)
	);

	const onDeleteEvenetClick = (id) => {
		deleteEventFromLocalStorage(id);
		dispatch(deleteEvent(id));
	};

	return (
		<Container maxWidth="md">
			<Typography component="h1" align="center" variant="h5">
				Ваш список событий
			</Typography>
			<Box mt={3}>
				<Grid container spacing={2}>
					<Grid item container xs direction="column" align="center">
						<Grid item xs>
							<StaticDatePicker
								label="Выберите дату"
								value={date}
								minDate={new Date("2000-01-01")}
								maxDate={new Date("2099-12-31")}
								onChange={(newValue) => {
									setDate(newValue);
								}}
								onMonthChange={handleMonthChange}
								renderInput={(params) => (
									<TextField {...params} />
								)}
								renderDay={(day, _value, DayComponentProps) => {
									const isSelected =
										!DayComponentProps.outsideCurrentMonth &&
										highlightedDays.indexOf(
											day.getDate()
										) >= 0;

									return (
										<Badge
											key={day.toString()}
											overlap="circular"
											color="secondary"
											variant={isSelected ? "dot" : ""}
										>
											<PickersDay
												{...DayComponentProps}
											/>
										</Badge>
									);
								}}
							/>
						</Grid>
						<Grid item xs>
							<Button
								component={Link}
								to="/create-event"
								variant="contained"
								size="large"
							>
								Добавить
							</Button>
						</Grid>
					</Grid>
					<Grid item xs>
						{filteredEventsByDate.length > 0 ? (
							<EventsList
								items={filteredEventsByDate}
								onDeleteEventButtonClick={onDeleteEvenetClick}
							/>
						) : (
							<Typography
								color="primary"
								component="h6"
								align="center"
								variant="h6"
							>
								На этот день не запланированы события
							</Typography>
						)}
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}
