import React from "react";
import { Link } from "react-router-dom";

import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) => ({
	list: {
		border: "1px solid rgba(0, 0, 0, 0.12)",
	},
	actions: {
		opacity: 0,
		pointerEvents: "none",
		transition: theme.transitions.create(["opacity"], {
			duration: theme.transitions.duration.standard,
		}),
	},
	listItem: {
		position: "relative",
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
		"&:last-child": {
			border: 0,
		},
		"&:hover": {
			"& $actions": {
				opacity: 1,
				pointerEvents: "auto",
			},
		},
	},

	itemTitle: {
		color: theme.palette.primary.main,
	},
	itemLine: {
		marginTop: "4px",
	},
}));

export default function EventsList({ items, onDeleteEventButtonClick }) {
	const classes = useStyles();
	return (
		<List className={classes.list} style={{ padding: 0 }}>
			{items.map((item) => (
				<ListItem
					key={item.id}
					className={classes.listItem}
					style={{ display: "block" }}
				>
					<Grid
						container
						wrap="nowrap"
						justifyContent="flex-end"
						alignItems="center"
					>
						<Grid item xs={12}>
							<Typography
								fontWeight={600}
								component="h4"
								variant="body1"
								className={classes.itemTitle}
							>
								{item.name}
							</Typography>
						</Grid>
						<Grid
							className={classes.actions}
							container
							item
							xs
							wrap="nowrap"
						>
							<Grid item xs>
								<IconButton
									component={Link}
									to={`/create-event/${item.id}`}
									aria-label="edit"
								>
									<EditIcon fontSize="medium" />
								</IconButton>
							</Grid>
							<Grid item xs>
								<IconButton
									onClick={() =>
										onDeleteEventButtonClick(item.id)
									}
									aria-label="delete"
								>
									<DeleteIcon fontSize="medium" />
								</IconButton>
							</Grid>
						</Grid>
					</Grid>

					{item.text && (
						<Box className={classes.itemLine}>
							<Typography component="span" variant="body1">
								{item.text}
							</Typography>
						</Box>
					)}
					{item.money && (
						<Box className={classes.itemLine}>
							<Typography component="span" variant="body1">
								Бюджет: {item.money} руб
							</Typography>
						</Box>
					)}
					{item.adress && (
						<Box className={classes.itemLine}>
							<Typography component="span" variant="body1">
								Адрес: {item.adress}
							</Typography>
						</Box>
					)}
					{item.time && (
						<Box className={classes.itemLine}>
							<Typography component="span" variant="body1">
								Время: {item.time}
							</Typography>
						</Box>
					)}
				</ListItem>
			))}
		</List>
	);
}
