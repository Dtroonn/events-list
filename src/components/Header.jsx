import React from "react";
import { NavLink } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
	header: {
		marginBottom: theme.spacing(4),
	},
	button: {
		"&:first-child": {
			marginRight: theme.spacing(2),
		},
		"&.active": {
			color: theme.palette.secondary.main,
			"&:hover": {
				color: theme.palette.secondary.light,
			},
		},
	},
}));

export default function Header() {
	const classes = useStyles();
	return (
		<header className={classes.header}>
			<AppBar position="static">
				<Toolbar>
					<Button
						exact
						style={{ fontWeight: 600 }}
						color="inherit"
						className={classes.button}
						component={NavLink}
						to="/"
					>
						Список событий
					</Button>
					<Button
						style={{ fontWeight: 600 }}
						color="inherit"
						className={classes.button}
						component={NavLink}
						to="/create-event"
					>
						Создать событие
					</Button>
				</Toolbar>
			</AppBar>
		</header>
	);
}
